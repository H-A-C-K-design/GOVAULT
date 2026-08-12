export type UserRole = 'super_admin' | 'department_admin' | 'officer' | 'reviewer';

export type AccountStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'deactivated';

export interface UserProfile {
  uid: string;
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
  role: UserRole;
  accountStatus: AccountStatus;
  rejectionReason?: string;
  emailVerified: boolean;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  adminIds: string[];
  adminNames?: string[];
  officerCount: number;
  documentCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory = 
  | 'Circular' 
  | 'Policy' 
  | 'Order' 
  | 'Gazette' 
  | 'Report' 
  | 'Memo' 
  | 'NOC' 
  | 'Tender' 
  | 'Financial' 
  | 'Other';

export type DocumentStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Review' 
  | 'Changes Requested' 
  | 'Approved' 
  | 'Rejected' 
  | 'Archived';

export type ConfidentialityLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export type PriorityLevel = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface GovernmentDocument {
  id: string;
  documentNumber: string;
  title: string;
  description: string;
  departmentId: string;
  departmentName: string;
  category: DocumentCategory;
  status: DocumentStatus;
  priority: PriorityLevel;
  confidentiality: ConfidentialityLevel;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  currentVersion: number;
  storagePath: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  remarks?: string;
  effectiveDate?: string;
  relatedDepartment?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  changeDescription: string;
  storagePath: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
}

export interface ApprovalWorkflowStep {
  id: string;
  documentId: string;
  stage: 'Uploaded' | 'Verification' | 'Review' | 'Approval' | 'Archived';
  actorId: string;
  actorName: string;
  actorRole: string;
  action: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'changes_requested';
  remarks?: string;
  timestamp: string;
  versionNumber: number;
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'registration' | 'document' | 'approval';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  resourceType: 'user' | 'document' | 'department' | 'auth' | 'system';
  resourceId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  result: 'success' | 'failure';
  timestamp: string;
}

export interface SystemStatusInfo {
  authStatus: 'operational' | 'degraded' | 'maintenance';
  databaseStatus: 'operational' | 'degraded' | 'maintenance';
  storageStatus: 'operational' | 'degraded' | 'maintenance';
  appStatus: 'operational' | 'degraded' | 'maintenance';
  overallStatus: 'operational' | 'degraded' | 'maintenance';
  activeOfficers: number;
  totalDocuments: number;
  storageUsedMB: number;
  port: number;
  protocol: 'HTTPS/TLS';
  lastChecked: string;
}
