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
    officerCount: 1,
    documentCount: 0,
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
    officerCount: 1,
    documentCount: 0,
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
    officerCount: 1,
    documentCount: 0,
    status: 'active',
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  }
];

export const DEMO_USERS: UserProfile[] = [];
export const INITIAL_DOCUMENTS: GovernmentDocument[] = [];
export const INITIAL_VERSIONS: DocumentVersion[] = [];
export const INITIAL_WORKFLOWS: ApprovalWorkflowStep[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];
