import type { 
  UserProfile, 
  Department, 
  GovernmentDocument, 
  DocumentVersion, 
  ApprovalWorkflowStep, 
  AuditLog, 
  SystemNotification 
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-fin-001',
    name: 'Finance & Revenue Department',
    code: 'FIN',
    description: 'State financial administration, fiscal policy, state budget allocation, taxation, and treasury management.',
    adminIds: ['user-admin-001'],
    adminNames: ['Chief Secretariat Administrator'],
    officerCount: 142,
    documentCount: 86,
    status: 'active',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  },
  {
    id: 'dept-home-002',
    name: 'Home Affairs & Public Safety',
    code: 'HOME',
    description: 'Internal security, state police administration, emergency services, civil defense, and law & order.',
    adminIds: ['user-admin-001'],
    adminNames: ['Chief Secretariat Administrator'],
    officerCount: 215,
    documentCount: 140,
    status: 'active',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  },
  {
    id: 'dept-it-003',
    name: 'Information Technology & e-Governance',
    code: 'ITD',
    description: 'State digital infrastructure, cyber governance, official document repository systems, and enterprise cloud operations.',
    adminIds: ['user-admin-001'],
    adminNames: ['Chief Secretariat Administrator'],
    officerCount: 98,
    documentCount: 112,
    status: 'active',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  },
  {
    id: 'dept-urb-004',
    name: 'Urban Infrastructure & Housing',
    code: 'URB',
    description: 'Urban planning, municipal administration, smart city infrastructure projects, and public housing development.',
    adminIds: ['user-admin-001'],
    adminNames: ['Chief Secretariat Administrator'],
    officerCount: 110,
    documentCount: 64,
    status: 'active',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  },
  {
    id: 'dept-health-005',
    name: 'Health & Family Welfare',
    code: 'HFW',
    description: 'Public healthcare administration, medical services, hospital regulation, and state health emergency response.',
    adminIds: ['user-admin-001'],
    adminNames: ['Chief Secretariat Administrator'],
    officerCount: 180,
    documentCount: 95,
    status: 'active',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    uid: 'user-admin-001',
    fullName: 'Chief Secretariat Administrator',
    officialEmail: 'admin@gov.in',
    employeeId: 'EMP-GOV-001',
    departmentId: 'dept-it-003',
    departmentName: 'Information Technology & e-Governance',
    designation: 'Chief Information Officer',
    officeBranch: 'Main Secretariat Wing A',
    mobileNumber: '+91 9876543210',
    joiningDate: '2020-01-15',
    role: 'super_admin',
    accountStatus: 'approved',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z',
    lastLoginAt: '2026-08-14T12:00:00.000Z'
  },
  {
    uid: 'user-dept-admin-002',
    fullName: 'Dr. Rajesh Verma',
    officialEmail: 'r.verma@finance.gov.in',
    employeeId: 'EMP-FIN-102',
    departmentId: 'dept-fin-001',
    departmentName: 'Finance & Revenue Department',
    designation: 'Joint Secretary (Budget)',
    officeBranch: 'Secretariat Block B, 3rd Floor',
    mobileNumber: '+91 9876543211',
    joiningDate: '2021-06-01',
    role: 'department_admin',
    accountStatus: 'approved',
    emailVerified: true,
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z',
    lastLoginAt: '2026-08-14T11:30:00.000Z'
  },
  {
    uid: 'user-officer-003',
    fullName: 'Priya Sharma',
    officialEmail: 'priya.sharma@home.gov.in',
    employeeId: 'EMP-HOME-205',
    departmentId: 'dept-home-002',
    departmentName: 'Home Affairs & Public Safety',
    designation: 'Under Secretary (Public Safety)',
    officeBranch: 'North Block Annex',
    mobileNumber: '+91 9876543212',
    joiningDate: '2022-03-15',
    role: 'officer',
    accountStatus: 'approved',
    emailVerified: true,
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z',
    lastLoginAt: '2026-08-14T09:15:00.000Z'
  },
  {
    uid: 'user-reviewer-004',
    fullName: 'Anil Kumar Subbaraman',
    officialEmail: 'anil.k@it.gov.in',
    employeeId: 'EMP-IT-304',
    departmentId: 'dept-it-003',
    departmentName: 'Information Technology & e-Governance',
    designation: 'Senior Technical Director',
    officeBranch: 'IT Tower 2',
    mobileNumber: '+91 9876543213',
    joiningDate: '2019-11-01',
    role: 'reviewer',
    accountStatus: 'approved',
    emailVerified: true,
    createdAt: '2026-02-12T00:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z',
    lastLoginAt: '2026-08-14T08:45:00.000Z'
  }
];

export const INITIAL_DOCUMENTS: GovernmentDocument[] = [
  {
    id: 'doc-fin-2026-001',
    documentNumber: 'DOC-2026-FIN-401',
    title: 'State Annual Fiscal Policy & Budgetary Allocation Guidelines FY 2026-27',
    description: 'Comprehensive guidelines for state department budget proposals, expenditure ceilings, and capital allocation frameworks.',
    departmentId: 'dept-fin-001',
    departmentName: 'Finance & Revenue Department',
    category: 'Policy',
    status: 'Approved',
    priority: 'Urgent',
    confidentiality: 'Confidential',
    ownerId: 'user-dept-admin-002',
    ownerName: 'Dr. Rajesh Verma',
    ownerEmail: 'r.verma@finance.gov.in',
    currentVersion: 2,
    storagePath: 'documents/dept-fin-001/doc-fin-2026-001/version-2/Fiscal_Policy_2026.pdf',
    fileUrl: '',
    fileName: 'Fiscal_Policy_2026.pdf',
    fileSize: 2450120,
    mimeType: 'application/pdf',
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-08-01T14:30:00.000Z',
    createdBy: 'user-dept-admin-002',
    tags: ['Fiscal Policy', 'Budget 2026', 'Finance', 'State Budget'],
    assignedReviewerId: 'user-admin-001',
    assignedReviewerName: 'Chief Secretariat Administrator',
    effectiveDate: '2026-08-01'
  },
  {
    id: 'doc-it-2026-002',
    documentNumber: 'DOC-2026-ITD-108',
    title: 'State Enterprise Document Encryption & Security Protocol standard v4.2',
    description: 'Security requirements, access logging, digital signatures, and TLS encryption compliance for official government document repositories.',
    departmentId: 'dept-it-003',
    departmentName: 'Information Technology & e-Governance',
    category: 'Circular',
    status: 'Approved',
    priority: 'High',
    confidentiality: 'Restricted',
    ownerId: 'user-reviewer-004',
    ownerName: 'Anil Kumar Subbaraman',
    ownerEmail: 'anil.k@it.gov.in',
    currentVersion: 1,
    storagePath: 'documents/dept-it-003/doc-it-2026-002/version-1/GovDoc_Security_Standard_v4.2.pdf',
    fileUrl: '',
    fileName: 'GovDoc_Security_Standard_v4.2.pdf',
    fileSize: 1845000,
    mimeType: 'application/pdf',
    createdAt: '2026-07-15T09:00:00.000Z',
    updatedAt: '2026-07-20T11:00:00.000Z',
    createdBy: 'user-reviewer-004',
    tags: ['Security', 'e-Governance', 'Encryption', 'Compliance'],
    assignedReviewerId: 'user-admin-001',
    assignedReviewerName: 'Chief Secretariat Administrator',
    effectiveDate: '2026-08-15'
  },
  {
    id: 'doc-home-2026-003',
    documentNumber: 'DOC-2026-HOME-720',
    title: 'State Security Preparedness & Inter-Agency Coordination Directive',
    description: 'Protocol directive for inter-departmental security communications and emergency response coordination.',
    departmentId: 'dept-home-002',
    departmentName: 'Home Affairs & Public Safety',
    category: 'Order',
    status: 'Under Review',
    priority: 'High',
    confidentiality: 'Restricted',
    ownerId: 'user-officer-003',
    ownerName: 'Priya Sharma',
    ownerEmail: 'priya.sharma@home.gov.in',
    currentVersion: 1,
    storagePath: 'documents/dept-home-002/doc-home-2026-003/version-1/Security_Directive_2026.pdf',
    fileUrl: '',
    fileName: 'Security_Directive_2026.pdf',
    fileSize: 3120000,
    mimeType: 'application/pdf',
    createdAt: '2026-08-05T14:00:00.000Z',
    updatedAt: '2026-08-10T16:00:00.000Z',
    createdBy: 'user-officer-003',
    tags: ['Home Affairs', 'Security', 'Directive'],
    assignedReviewerId: 'user-reviewer-004',
    assignedReviewerName: 'Anil Kumar Subbaraman'
  }
];

export const INITIAL_VERSIONS: DocumentVersion[] = [
  {
    id: 'ver-doc-fin-2026-001-v1',
    documentId: 'doc-fin-2026-001',
    versionNumber: 1,
    changeDescription: 'Initial draft submission of state fiscal policy.',
    storagePath: 'documents/dept-fin-001/doc-fin-2026-001/version-1/Fiscal_Policy_Draft.pdf',
    fileUrl: '',
    fileName: 'Fiscal_Policy_Draft.pdf',
    fileSize: 2400000,
    uploadedBy: 'user-dept-admin-002',
    uploadedByName: 'Dr. Rajesh Verma',
    createdAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'ver-doc-fin-2026-001-v2',
    documentId: 'doc-fin-2026-001',
    versionNumber: 2,
    changeDescription: 'Incorporated Cabinet Committee amendments on capital expenditure allocations.',
    storagePath: 'documents/dept-fin-001/doc-fin-2026-001/version-2/Fiscal_Policy_2026.pdf',
    fileUrl: '',
    fileName: 'Fiscal_Policy_2026.pdf',
    fileSize: 2450120,
    uploadedBy: 'user-dept-admin-002',
    uploadedByName: 'Dr. Rajesh Verma',
    createdAt: '2026-08-01T14:30:00.000Z'
  }
];

export const INITIAL_WORKFLOWS: ApprovalWorkflowStep[] = [
  {
    id: 'wf-doc-fin-2026-001-1',
    documentId: 'doc-fin-2026-001',
    stage: 'Uploaded',
    actorId: 'user-dept-admin-002',
    actorName: 'Dr. Rajesh Verma',
    actorRole: 'department_admin',
    action: 'submitted',
    remarks: 'Document created and submitted to verification workflow.',
    timestamp: '2026-07-01T10:00:00.000Z',
    versionNumber: 1
  },
  {
    id: 'wf-doc-fin-2026-001-2',
    documentId: 'doc-fin-2026-001',
    stage: 'Approval',
    actorId: 'user-admin-001',
    actorName: 'Chief Secretariat Administrator',
    actorRole: 'super_admin',
    action: 'approved',
    remarks: 'Approved by Chief Secretariat after final budgetary review.',
    timestamp: '2026-08-01T14:30:00.000Z',
    versionNumber: 2
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-seed-1',
    actorId: 'user-admin-001',
    actorName: 'Chief Secretariat Administrator',
    actorEmail: 'admin@gov.in',
    actorRole: 'super_admin',
    action: 'SYSTEM_INITIALIZATION',
    resourceType: 'system',
    resourceId: 'sys-init',
    details: 'State Secretariat Government Document Portal initialized with Firebase Firestore connection.',
    result: 'success',
    timestamp: '2026-08-14T08:00:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-seed-1',
    userId: 'user-officer-003',
    title: 'Welcome to GovDoc Portal',
    message: 'Your official officer credentials have been activated. You can now submit and track official state documents.',
    type: 'system',
    read: false,
    createdAt: '2026-08-14T08:30:00.000Z'
  }
];
