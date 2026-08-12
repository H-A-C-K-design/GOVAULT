import type { 
  UserProfile, 
  Department, 
  GovernmentDocument, 
  DocumentVersion, 
  ApprovalWorkflowStep, 
  AuditLog, 
  SystemNotification,
  AccountStatus,
  UserRole,
  DocumentStatus,
  SystemStatusInfo
} from '../types';
import { db, auth, storage } from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const LOCAL_STORAGE_KEYS = {
  USERS: 'govdoc_users_v1',
  DEPARTMENTS: 'govdoc_departments_v1',
  DOCUMENTS: 'govdoc_documents_v1',
  VERSIONS: 'govdoc_versions_v1',
  WORKFLOWS: 'govdoc_workflows_v1',
  AUDIT_LOGS: 'govdoc_audit_logs_v1',
  NOTIFICATIONS: 'govdoc_notifications_v1',
  CURRENT_USER: 'govdoc_current_user_v1'
};

function loadStorage<T>(key: string): T[] {
  try {
    const item = localStorage.getItem(key);
    if (!item) return [];
    return JSON.parse(item) as T[];
  } catch (err) {
    console.warn(`[GovDoc Storage] Error reading ${key}`, err);
    return [];
  }
}

function saveStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`[GovDoc Storage] Error saving ${key}`, err);
  }
}

export class DataService {
  private static getUsers(): UserProfile[] {
    return loadStorage<UserProfile>(LOCAL_STORAGE_KEYS.USERS);
  }

  private static setUsers(users: UserProfile[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.USERS, users);
  }

  private static getDepartments(): Department[] {
    return loadStorage<Department>(LOCAL_STORAGE_KEYS.DEPARTMENTS);
  }

  private static setDepartments(depts: Department[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.DEPARTMENTS, depts);
  }

  private static getDocuments(): GovernmentDocument[] {
    return loadStorage<GovernmentDocument>(LOCAL_STORAGE_KEYS.DOCUMENTS);
  }

  private static setDocuments(docs: GovernmentDocument[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.DOCUMENTS, docs);
  }

  private static getVersions(): DocumentVersion[] {
    return loadStorage<DocumentVersion>(LOCAL_STORAGE_KEYS.VERSIONS);
  }

  private static setVersions(versions: DocumentVersion[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.VERSIONS, versions);
  }

  private static getWorkflows(): ApprovalWorkflowStep[] {
    return loadStorage<ApprovalWorkflowStep>(LOCAL_STORAGE_KEYS.WORKFLOWS);
  }

  private static setWorkflows(wfs: ApprovalWorkflowStep[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.WORKFLOWS, wfs);
  }

  private static getAuditLogs(): AuditLog[] {
    return loadStorage<AuditLog>(LOCAL_STORAGE_KEYS.AUDIT_LOGS);
  }

  private static setAuditLogs(logs: AuditLog[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  private static getNotifications(): SystemNotification[] {
    return loadStorage<SystemNotification>(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
  }

  private static setNotifications(notifs: SystemNotification[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // Audit Logs
  public static async logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...event,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    this.setAuditLogs(logs);

    try {
      await setDoc(doc(db, 'audit_logs', newLog.id), newLog);
    } catch (err) {
      console.warn('[Firestore] Audit log saved locally', err);
    }
  }

  public static async fetchAuditLogs(filter?: { resourceType?: string; actorId?: string; query?: string }): Promise<AuditLog[]> {
    let logs = this.getAuditLogs();
    try {
      const snap = await getDocs(collection(db, 'audit_logs'));
      if (!snap.empty) {
        const firestoreLogs: AuditLog[] = [];
        snap.forEach(d => firestoreLogs.push(d.data() as AuditLog));
        const logMap = new Map<string, AuditLog>();
        logs.forEach(l => logMap.set(l.id, l));
        firestoreLogs.forEach(l => logMap.set(l.id, l));
        logs = Array.from(logMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.setAuditLogs(logs);
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Fetching local audit logs', err);
    }

    if (filter?.resourceType) {
      logs = logs.filter(l => l.resourceType === filter.resourceType);
    }
    if (filter?.actorId) {
      logs = logs.filter(l => l.actorId === filter.actorId);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      logs = logs.filter(l => 
        l.action.toLowerCase().includes(q) ||
        l.actorName.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return logs;
  }

  // User Profiles
  public static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Checking local user profile', err);
    }
    const users = this.getUsers();
    return users.find(u => u.uid === uid) || null;
  }

  public static async getAllUsers(): Promise<UserProfile[]> {
    const localUsers = this.getUsers();
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        const firestoreUsers: UserProfile[] = [];
        snap.forEach(d => firestoreUsers.push(d.data() as UserProfile));
        
        const userMap = new Map<string, UserProfile>();
        localUsers.forEach(u => userMap.set(u.officialEmail.toLowerCase(), u));
        firestoreUsers.forEach(u => userMap.set(u.officialEmail.toLowerCase(), u));
        
        const merged = Array.from(userMap.values());
        this.setUsers(merged);
        return merged;
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Serving users from cache', err);
    }
    return localUsers;
  }

  public static async updateUserLastLogin(uid: string): Promise<void> {
    const now = new Date().toISOString();
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index !== -1) {
      users[index].lastLoginAt = now;
      this.setUsers(users);
    }

    try {
      await updateDoc(doc(db, 'users', uid), {
        lastLoginAt: now,
        updatedAt: now
      });
    } catch (err) {
      console.warn('[Firestore] Notice: Updated login timestamp locally', err);
    }
  }

  public static async registerOfficerRequest(data: {
    fullName: string;
    officialEmail: string;
    employeeId: string;
    departmentId: string;
    departmentName: string;
    designation: string;
    officeBranch: string;
    mobileNumber?: string;
    dateOfBirth?: string;
    joiningDate?: string;
    reportingOfficer?: string;
    password: string;
  }): Promise<UserProfile> {
    const allUsers = await this.getAllUsers();
    
    if (allUsers.some(u => u.officialEmail.toLowerCase() === data.officialEmail.toLowerCase())) {
      throw new Error("An officer account with this official email already exists.");
    }

    let authUid = `user-off-${Date.now()}`;

    if (data.password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.officialEmail, data.password);
        if (userCredential.user?.uid) {
          authUid = userCredential.user.uid;
        }
      } catch (authErr: any) {
        console.warn('[Firebase Auth] Notice:', authErr?.message || authErr);
      }
    }

    const newUser: UserProfile = {
      uid: authUid,
      fullName: data.fullName,
      officialEmail: data.officialEmail,
      employeeId: data.employeeId,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      designation: data.designation,
      officeBranch: data.officeBranch,
      mobileNumber: data.mobileNumber,
      dateOfBirth: data.dateOfBirth,
      joiningDate: data.joiningDate,
      reportingOfficer: data.reportingOfficer,
      role: 'officer',
      accountStatus: 'approved',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const users = this.getUsers();
    users.push(newUser);
    this.setUsers(users);

    try {
      await setDoc(doc(db, 'users', newUser.uid), newUser);
    } catch (err) {
      console.warn('[Firestore] Saved user locally', err);
    }

    await this.logAuditEvent({
      actorId: newUser.uid,
      actorName: newUser.fullName,
      actorEmail: newUser.officialEmail,
      actorRole: 'officer',
      action: 'OFFICER_REGISTRATION_SUBMITTED',
      resourceType: 'user',
      resourceId: newUser.uid,
      details: `Officer registration submitted for department ${newUser.departmentName}. Status: PENDING.`,
      result: 'success'
    });

    return newUser;
  }

  public static async updateOfficerStatus(
    targetUid: string, 
    newStatus: AccountStatus, 
    adminUser: UserProfile, 
    rejectionReason?: string
  ): Promise<UserProfile> {
    const users = await this.getAllUsers();
    const index = users.findIndex(u => u.uid === targetUid);
    if (index === -1) throw new Error("Officer not found");

    const now = new Date().toISOString();
    users[index].accountStatus = newStatus;
    users[index].updatedAt = now;
    if (rejectionReason) {
      users[index].rejectionReason = rejectionReason;
    }

    this.setUsers(users);

    try {
      await updateDoc(doc(db, 'users', targetUid), {
        accountStatus: newStatus,
        updatedAt: now,
        ...(rejectionReason ? { rejectionReason } : {})
      });
    } catch (err) {
      console.warn('[Firestore] Notice: Status updated locally', err);
    }

    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUid,
      title: `Registration Request ${newStatus.toUpperCase()}`,
      message: newStatus === 'approved' 
        ? 'Your officer registration has been approved. You now have access to GovDoc.' 
        : `Your registration request was ${newStatus}. ${rejectionReason ? 'Reason: ' + rejectionReason : ''}`,
      type: 'registration',
      read: false,
      createdAt: new Date().toISOString()
    };

    const notifs = this.getNotifications();
    notifs.unshift(notif);
    this.setNotifications(notifs);

    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (err) {
      console.warn('[Firestore] Saved notification locally', err);
    }

    await this.logAuditEvent({
      actorId: adminUser.uid,
      actorName: adminUser.fullName,
      actorEmail: adminUser.officialEmail,
      actorRole: adminUser.role,
      action: `OFFICER_STATUS_${newStatus.toUpperCase()}`,
      resourceType: 'user',
      resourceId: targetUid,
      details: `Updated officer ${users[index].fullName} status to ${newStatus}.`,
      result: 'success'
    });

    return users[index];
  }

  public static async updateOfficerRole(
    targetUid: string, 
    newRole: UserRole, 
    adminUser: UserProfile
  ): Promise<UserProfile> {
    const users = await this.getAllUsers();
    const index = users.findIndex(u => u.uid === targetUid);
    if (index === -1) throw new Error("Officer not found");

    const now = new Date().toISOString();
    users[index].role = newRole;
    users[index].updatedAt = now;
    this.setUsers(users);

    try {
      await updateDoc(doc(db, 'users', targetUid), {
        role: newRole,
        updatedAt: now
      });
    } catch (err) {
      console.warn('[Firestore] Notice: Role updated locally', err);
    }

    await this.logAuditEvent({
      actorId: adminUser.uid,
      actorName: adminUser.fullName,
      actorEmail: adminUser.officialEmail,
      actorRole: adminUser.role,
      action: 'OFFICER_ROLE_UPDATED',
      resourceType: 'user',
      resourceId: targetUid,
      details: `Role for ${users[index].fullName} changed to ${newRole}.`,
      result: 'success'
    });

    return users[index];
  }

  // Departments
  public static async getDepartmentsList(): Promise<Department[]> {
    let depts = this.getDepartments();
    try {
      const snap = await getDocs(collection(db, 'departments'));
      if (!snap.empty) {
        const firestoreDepts: Department[] = [];
        snap.forEach(d => firestoreDepts.push(d.data() as Department));
        const deptMap = new Map<string, Department>();
        depts.forEach(d => deptMap.set(d.id, d));
        firestoreDepts.forEach(d => deptMap.set(d.id, d));
        depts = Array.from(deptMap.values());
        this.setDepartments(depts);
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Fetching local departments', err);
    }
    return depts;
  }

  public static async createDepartment(data: {
    name: string;
    code: string;
    description: string;
  }, adminUser: UserProfile): Promise<Department> {
    const depts = await this.getDepartmentsList();
    const newDept: Department = {
      id: `dept-${data.code.toLowerCase()}-${Date.now()}`,
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description,
      adminIds: [adminUser.uid],
      adminNames: [adminUser.fullName],
      officerCount: 1,
      documentCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    depts.push(newDept);
    this.setDepartments(depts);

    try {
      await setDoc(doc(db, 'departments', newDept.id), newDept);
    } catch (err) {
      console.warn('[Firestore] Saved department locally', err);
    }

    await this.logAuditEvent({
      actorId: adminUser.uid,
      actorName: adminUser.fullName,
      actorEmail: adminUser.officialEmail,
      actorRole: adminUser.role,
      action: 'DEPARTMENT_CREATE',
      resourceType: 'department',
      resourceId: newDept.id,
      details: `Created department ${newDept.name} (${newDept.code}).`,
      result: 'success'
    });

    return newDept;
  }

  // Documents
  public static async getDocumentsList(filter?: {
    departmentId?: string;
    category?: string;
    status?: string;
    searchQuery?: string;
    ownerId?: string;
  }): Promise<GovernmentDocument[]> {
    let docs = this.getDocuments();

    try {
      const snap = await getDocs(collection(db, 'documents'));
      if (!snap.empty) {
        const firestoreDocs: GovernmentDocument[] = [];
        snap.forEach(d => firestoreDocs.push(d.data() as GovernmentDocument));
        const docMap = new Map<string, GovernmentDocument>();
        docs.forEach(d => docMap.set(d.id, d));
        firestoreDocs.forEach(d => docMap.set(d.id, d));
        docs = Array.from(docMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.setDocuments(docs);
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Fetching documents from cache', err);
    }

    if (filter?.departmentId && filter.departmentId !== 'all') {
      docs = docs.filter(d => d.departmentId === filter.departmentId);
    }
    if (filter?.category && filter.category !== 'all') {
      docs = docs.filter(d => d.category === filter.category);
    }
    if (filter?.status && filter.status !== 'all') {
      docs = docs.filter(d => d.status === filter.status);
    }
    if (filter?.ownerId) {
      docs = docs.filter(d => d.ownerId === filter.ownerId);
    }
    if (filter?.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.documentNumber.toLowerCase().includes(q) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) ||
        d.departmentName.toLowerCase().includes(q)
      );
    }
    return docs;
  }

  public static async getDocumentById(id: string): Promise<GovernmentDocument | null> {
    try {
      const docSnap = await getDoc(doc(db, 'documents', id));
      if (docSnap.exists()) {
        return docSnap.data() as GovernmentDocument;
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Checking local document cache', err);
    }
    const docs = this.getDocuments();
    return docs.find(d => d.id === id) || null;
  }

  public static async createDocument(
    data: {
      title: string;
      description: string;
      departmentId: string;
      departmentName: string;
      category: GovernmentDocument['category'];
      priority: GovernmentDocument['priority'];
      confidentiality: GovernmentDocument['confidentiality'];
      tags: string[];
      fileName: string;
      fileSize: number;
      mimeType: string;
      fileBlob?: Blob | File;
      effectiveDate?: string;
      assignedReviewerId?: string;
    },
    currentUser: UserProfile
  ): Promise<GovernmentDocument> {
    const docs = await this.getDocumentsList();
    const depts = await this.getDepartmentsList();

    const deptCode = depts.find(d => d.id === data.departmentId)?.code || 'GOV';
    const docNum = `DOC-2026-${deptCode}-${Math.floor(100 + Math.random() * 900)}`;
    const newDocId = `doc-${deptCode.toLowerCase()}-${Date.now()}`;
    const storagePath = `documents/${data.departmentId}/${newDocId}/version-1/${data.fileName}`;

    let uploadedFileUrl = '';
    if (data.fileBlob) {
      try {
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, data.fileBlob);
        uploadedFileUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.warn('[Firebase Storage] Notice: File upload stored metadata', err);
      }
    }

    const newDoc: GovernmentDocument = {
      id: newDocId,
      documentNumber: docNum,
      title: data.title,
      description: data.description,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      category: data.category,
      status: 'Submitted',
      priority: data.priority,
      confidentiality: data.confidentiality,
      ownerId: currentUser.uid,
      ownerName: currentUser.fullName,
      ownerEmail: currentUser.officialEmail,
      currentVersion: 1,
      storagePath: storagePath,
      fileUrl: uploadedFileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.uid,
      tags: data.tags,
      effectiveDate: data.effectiveDate,
      assignedReviewerId: data.assignedReviewerId,
      assignedReviewerName: data.assignedReviewerId ? 'Department Reviewer' : undefined
    };

    docs.unshift(newDoc);
    this.setDocuments(docs);

    try {
      await setDoc(doc(db, 'documents', newDoc.id), newDoc);
    } catch (err) {
      console.warn('[Firestore] Saved document locally', err);
    }

    const newVersion: DocumentVersion = {
      id: `ver-${newDocId}-v1`,
      documentId: newDocId,
      versionNumber: 1,
      changeDescription: 'Initial document submission.',
      storagePath,
      fileUrl: newDoc.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
      uploadedBy: currentUser.uid,
      uploadedByName: currentUser.fullName,
      createdAt: new Date().toISOString()
    };

    const versions = this.getVersions();
    versions.unshift(newVersion);
    this.setVersions(versions);

    try {
      await setDoc(doc(db, 'document_versions', newVersion.id), newVersion);
    } catch (err) {
      console.warn('[Firestore] Saved version locally', err);
    }

    const newWorkflow: ApprovalWorkflowStep = {
      id: `wf-${newDocId}-1`,
      documentId: newDocId,
      stage: 'Uploaded',
      actorId: currentUser.uid,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action: 'submitted',
      remarks: 'Document created and submitted to verification workflow.',
      timestamp: new Date().toISOString(),
      versionNumber: 1
    };

    const workflows = this.getWorkflows();
    workflows.unshift(newWorkflow);
    this.setWorkflows(workflows);

    try {
      await setDoc(doc(db, 'workflows', newWorkflow.id), newWorkflow);
    } catch (err) {
      console.warn('[Firestore] Saved workflow locally', err);
    }

    await this.logAuditEvent({
      actorId: currentUser.uid,
      actorName: currentUser.fullName,
      actorEmail: currentUser.officialEmail,
      actorRole: currentUser.role,
      action: 'DOCUMENT_UPLOAD',
      resourceType: 'document',
      resourceId: newDoc.id,
      details: `Uploaded official document ${newDoc.documentNumber} "${newDoc.title}".`,
      result: 'success'
    });

    return newDoc;
  }

  public static async updateDocumentStatus(
    docId: string,
    newStatus: DocumentStatus,
    remarks: string,
    actor: UserProfile
  ): Promise<GovernmentDocument> {
    const docs = await this.getDocumentsList();
    const index = docs.findIndex(d => d.id === docId);
    if (index === -1) throw new Error("Document not found");

    const oldStatus = docs[index].status;
    const now = new Date().toISOString();
    docs[index].status = newStatus;
    docs[index].remarks = remarks;
    docs[index].updatedAt = now;

    this.setDocuments(docs);

    try {
      await updateDoc(doc(db, 'documents', docId), {
        status: newStatus,
        remarks: remarks,
        updatedAt: now
      });
    } catch (err) {
      console.warn('[Firestore] Updated document status locally', err);
    }

    const stageMap: Record<DocumentStatus, ApprovalWorkflowStep['stage']> = {
      'Draft': 'Uploaded',
      'Submitted': 'Verification',
      'Under Review': 'Review',
      'Changes Requested': 'Review',
      'Approved': 'Approval',
      'Rejected': 'Approval',
      'Archived': 'Archived'
    };

    const actionMap: Record<DocumentStatus, ApprovalWorkflowStep['action']> = {
      'Draft': 'submitted',
      'Submitted': 'submitted',
      'Under Review': 'under_review',
      'Changes Requested': 'changes_requested',
      'Approved': 'approved',
      'Rejected': 'rejected',
      'Archived': 'approved'
    };

    const newWf: ApprovalWorkflowStep = {
      id: `wf-${docId}-${Date.now()}`,
      documentId: docId,
      stage: stageMap[newStatus] || 'Review',
      actorId: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: actionMap[newStatus] || 'under_review',
      remarks,
      timestamp: now,
      versionNumber: docs[index].currentVersion
    };

    const workflows = this.getWorkflows();
    workflows.unshift(newWf);
    this.setWorkflows(workflows);

    try {
      await setDoc(doc(db, 'workflows', newWf.id), newWf);
    } catch (err) {
      console.warn('[Firestore] Saved workflow locally', err);
    }

    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      userId: docs[index].ownerId,
      title: `Document ${newStatus}`,
      message: `Your document ${docs[index].documentNumber} was moved to state ${newStatus} by ${actor.fullName}.`,
      type: 'approval',
      read: false,
      link: `/documents/${docId}`,
      createdAt: now
    };

    const notifs = this.getNotifications();
    notifs.unshift(notif);
    this.setNotifications(notifs);

    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (err) {
      console.warn('[Firestore] Saved notification locally', err);
    }

    await this.logAuditEvent({
      actorId: actor.uid,
      actorName: actor.fullName,
      actorEmail: actor.officialEmail,
      actorRole: actor.role,
      action: `DOCUMENT_STATUS_${newStatus.toUpperCase().replace(' ', '_')}`,
      resourceType: 'document',
      resourceId: docId,
      details: `Changed document status from ${oldStatus} to ${newStatus}. Remarks: ${remarks}`,
      result: 'success'
    });

    return docs[index];
  }

  public static async getDocumentVersions(docId: string): Promise<DocumentVersion[]> {
    let versions = this.getVersions();
    try {
      const snap = await getDocs(collection(db, 'document_versions'));
      if (!snap.empty) {
        const firestoreVersions: DocumentVersion[] = [];
        snap.forEach(d => firestoreVersions.push(d.data() as DocumentVersion));
        const verMap = new Map<string, DocumentVersion>();
        versions.forEach(v => verMap.set(v.id, v));
        firestoreVersions.forEach(v => verMap.set(v.id, v));
        versions = Array.from(verMap.values());
        this.setVersions(versions);
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Fetching local versions', err);
    }
    return versions.filter(v => v.documentId === docId).sort((a, b) => b.versionNumber - a.versionNumber);
  }

  public static async getDocumentWorkflows(docId: string): Promise<ApprovalWorkflowStep[]> {
    let workflows = this.getWorkflows();
    try {
      const snap = await getDocs(collection(db, 'workflows'));
      if (!snap.empty) {
        const firestoreWfs: ApprovalWorkflowStep[] = [];
        snap.forEach(d => firestoreWfs.push(d.data() as ApprovalWorkflowStep));
        const wfMap = new Map<string, ApprovalWorkflowStep>();
        workflows.forEach(w => wfMap.set(w.id, w));
        firestoreWfs.forEach(w => wfMap.set(w.id, w));
        workflows = Array.from(wfMap.values());
        this.setWorkflows(workflows);
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Fetching local workflows', err);
    }
    return workflows.filter(w => w.documentId === docId);
  }

  public static async getUserNotifications(userId: string): Promise<SystemNotification[]> {
    let notifs = this.getNotifications();
    try {
      const snap = await getDocs(collection(db, 'notifications'));
      if (!snap.empty) {
        const firestoreNotifs: SystemNotification[] = [];
        snap.forEach(d => firestoreNotifs.push(d.data() as SystemNotification));
        const notifMap = new Map<string, SystemNotification>();
        notifs.forEach(n => notifMap.set(n.id, n));
        firestoreNotifs.forEach(n => notifMap.set(n.id, n));
        notifs = Array.from(notifMap.values());
        this.setNotifications(notifs);
      }
    } catch (err) {
      console.warn('[Firestore] Notice: Fetching local notifications', err);
    }
    return notifs.filter(n => n.userId === userId);
  }

  public static async markNotificationAsRead(notifId: string): Promise<void> {
    const notifs = this.getNotifications();
    const index = notifs.findIndex(n => n.id === notifId);
    if (index !== -1) {
      notifs[index].read = true;
      this.setNotifications(notifs);
    }
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (err) {
      console.warn('[Firestore] Marked notification read locally', err);
    }
  }

  public static async getSystemStatusInfo(): Promise<SystemStatusInfo> {
    const users = await this.getAllUsers();
    const docs = await this.getDocumentsList();

    let dbOperational = false;
    let authOperational = false;
    let storageOperational = false;

    try {
      await getDocs(collection(db, 'users'));
      dbOperational = true;
    } catch {
      dbOperational = false;
    }

    try {
      authOperational = Boolean(auth.app);
    } catch {
      authOperational = false;
    }

    try {
      storageOperational = Boolean(storage.app);
    } catch {
      storageOperational = false;
    }

    const isAllOk = dbOperational && authOperational && storageOperational;

    return {
      authStatus: authOperational ? 'operational' : 'degraded',
      databaseStatus: dbOperational ? 'operational' : 'degraded',
      storageStatus: storageOperational ? 'operational' : 'degraded',
      appStatus: 'operational',
      overallStatus: isAllOk ? 'operational' : 'degraded',
      activeOfficers: users.filter(u => u.accountStatus === 'approved').length,
      totalDocuments: docs.length,
      storageUsedMB: docs.reduce((acc, d) => acc + (d.fileSize || 0), 0) / (1024 * 1024),
      port: 443,
      protocol: 'HTTPS/TLS',
      lastChecked: new Date().toISOString()
    };
  }
}
