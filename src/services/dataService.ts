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
import { 
  INITIAL_DEPARTMENTS, 
  DEMO_USERS, 
  INITIAL_DOCUMENTS, 
  INITIAL_VERSIONS, 
  INITIAL_WORKFLOWS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from './mockData';

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

function loadStorage<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[GovDoc Storage] Error reading ${key}`, err);
    return defaultData;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`[GovDoc Storage] Error saving ${key}`, err);
  }
}

export class DataService {
  private static getUsers(): UserProfile[] {
    return loadStorage<UserProfile[]>(LOCAL_STORAGE_KEYS.USERS, DEMO_USERS);
  }

  private static setUsers(users: UserProfile[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.USERS, users);
  }

  private static getDepartments(): Department[] {
    return loadStorage<Department[]>(LOCAL_STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }

  private static setDepartments(depts: Department[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.DEPARTMENTS, depts);
  }

  private static getDocuments(): GovernmentDocument[] {
    return loadStorage<GovernmentDocument[]>(LOCAL_STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  private static setDocuments(docs: GovernmentDocument[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.DOCUMENTS, docs);
  }

  private static getVersions(): DocumentVersion[] {
    return loadStorage<DocumentVersion[]>(LOCAL_STORAGE_KEYS.VERSIONS, INITIAL_VERSIONS);
  }

  private static setVersions(versions: DocumentVersion[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.VERSIONS, versions);
  }

  private static getWorkflows(): ApprovalWorkflowStep[] {
    return loadStorage<ApprovalWorkflowStep[]>(LOCAL_STORAGE_KEYS.WORKFLOWS, INITIAL_WORKFLOWS);
  }

  private static setWorkflows(wfs: ApprovalWorkflowStep[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.WORKFLOWS, wfs);
  }

  private static getAuditLogs(): AuditLog[] {
    return loadStorage<AuditLog[]>(LOCAL_STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  private static setAuditLogs(logs: AuditLog[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  private static getNotifications(): SystemNotification[] {
    return loadStorage<SystemNotification[]>(LOCAL_STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  private static setNotifications(notifs: SystemNotification[]): void {
    saveStorage(LOCAL_STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  public static async logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...event,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    this.setAuditLogs(logs);
  }

  public static async fetchAuditLogs(filter?: { resourceType?: string; actorId?: string; query?: string }): Promise<AuditLog[]> {
    let logs = this.getAuditLogs();
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

  public static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const users = this.getUsers();
    return users.find(u => u.uid === uid) || null;
  }

  public static async getAllUsers(): Promise<UserProfile[]> {
    return this.getUsers();
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
    const users = this.getUsers();
    
    if (users.some(u => u.officialEmail.toLowerCase() === data.officialEmail.toLowerCase())) {
      throw new Error("An officer account with this official email already exists.");
    }

    const newUser: UserProfile = {
      uid: `user-off-${Date.now()}`,
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
      accountStatus: 'pending',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    this.setUsers(users);

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
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === targetUid);
    if (index === -1) throw new Error("Officer not found");

    users[index].accountStatus = newStatus;
    users[index].updatedAt = new Date().toISOString();
    if (rejectionReason) {
      users[index].rejectionReason = rejectionReason;
    }

    this.setUsers(users);

    const notifs = this.getNotifications();
    notifs.unshift({
      id: `notif-${Date.now()}`,
      userId: targetUid,
      title: `Registration Request ${newStatus.toUpperCase()}`,
      message: newStatus === 'approved' 
        ? 'Your officer registration has been approved. You now have full access to GovDoc.' 
        : `Your registration request was ${newStatus}. ${rejectionReason ? 'Reason: ' + rejectionReason : ''}`,
      type: 'registration',
      read: false,
      createdAt: new Date().toISOString()
    });
    this.setNotifications(notifs);

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
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === targetUid);
    if (index === -1) throw new Error("Officer not found");

    users[index].role = newRole;
    users[index].updatedAt = new Date().toISOString();
    this.setUsers(users);

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

  public static async getDepartmentsList(): Promise<Department[]> {
    return this.getDepartments();
  }

  public static async createDepartment(data: {
    name: string;
    code: string;
    description: string;
  }, adminUser: UserProfile): Promise<Department> {
    const depts = this.getDepartments();
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

  public static async getDocumentsList(filter?: {
    departmentId?: string;
    category?: string;
    status?: string;
    searchQuery?: string;
    ownerId?: string;
  }): Promise<GovernmentDocument[]> {
    let docs = this.getDocuments();

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
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.departmentName.toLowerCase().includes(q)
      );
    }
    return docs;
  }

  public static async getDocumentById(id: string): Promise<GovernmentDocument | null> {
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
      effectiveDate?: string;
      assignedReviewerId?: string;
    },
    currentUser: UserProfile
  ): Promise<GovernmentDocument> {
    const docs = this.getDocuments();
    const depts = this.getDepartments();

    const deptCode = depts.find(d => d.id === data.departmentId)?.code || 'GOV';
    const docNum = `DOC-2026-${deptCode}-${Math.floor(100 + Math.random() * 900)}`;

    const newDocId = `doc-${deptCode.toLowerCase()}-${Date.now()}`;
    const storagePath = `documents/${data.departmentId}/${newDocId}/version-1/${data.fileName}`;

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
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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

    const versions = this.getVersions();
    versions.unshift({
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
    });
    this.setVersions(versions);

    const workflows = this.getWorkflows();
    workflows.unshift({
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
    });
    this.setWorkflows(workflows);

    const dIndex = depts.findIndex(d => d.id === data.departmentId);
    if (dIndex !== -1) {
      depts[dIndex].documentCount += 1;
      this.setDepartments(depts);
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
    const docs = this.getDocuments();
    const index = docs.findIndex(d => d.id === docId);
    if (index === -1) throw new Error("Document not found");

    const oldStatus = docs[index].status;
    docs[index].status = newStatus;
    docs[index].remarks = remarks;
    docs[index].updatedAt = new Date().toISOString();

    this.setDocuments(docs);

    const workflows = this.getWorkflows();
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

    workflows.unshift({
      id: `wf-${docId}-${Date.now()}`,
      documentId: docId,
      stage: stageMap[newStatus] || 'Review',
      actorId: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: actionMap[newStatus] || 'under_review',
      remarks,
      timestamp: new Date().toISOString(),
      versionNumber: docs[index].currentVersion
    });
    this.setWorkflows(workflows);

    const notifs = this.getNotifications();
    notifs.unshift({
      id: `notif-${Date.now()}`,
      userId: docs[index].ownerId,
      title: `Document ${newStatus}`,
      message: `Your document ${docs[index].documentNumber} was moved to state ${newStatus} by ${actor.fullName}.`,
      type: 'approval',
      read: false,
      link: `/documents/${docId}`,
      createdAt: new Date().toISOString()
    });
    this.setNotifications(notifs);

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
    const versions = this.getVersions();
    return versions.filter(v => v.documentId === docId).sort((a, b) => b.versionNumber - a.versionNumber);
  }

  public static async getDocumentWorkflows(docId: string): Promise<ApprovalWorkflowStep[]> {
    const workflows = this.getWorkflows();
    return workflows.filter(w => w.documentId === docId);
  }

  public static async getUserNotifications(userId: string): Promise<SystemNotification[]> {
    const notifs = this.getNotifications();
    return notifs.filter(n => n.userId === userId);
  }

  public static async markNotificationAsRead(notifId: string): Promise<void> {
    const notifs = this.getNotifications();
    const index = notifs.findIndex(n => n.id === notifId);
    if (index !== -1) {
      notifs[index].read = true;
      this.setNotifications(notifs);
    }
  }

  public static async getSystemStatusInfo(): Promise<SystemStatusInfo> {
    const users = this.getUsers();
    const docs = this.getDocuments();

    return {
      authStatus: 'operational',
      databaseStatus: 'operational',
      storageStatus: 'operational',
      appStatus: 'operational',
      overallStatus: 'operational',
      activeOfficers: users.filter(u => u.accountStatus === 'approved').length,
      totalDocuments: docs.length,
      storageUsedMB: 142.8,
      port: 443,
      protocol: 'HTTPS/TLS',
      lastChecked: new Date().toISOString()
    };
  }
}
