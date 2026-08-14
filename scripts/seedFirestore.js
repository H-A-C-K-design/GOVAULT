import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyC1H8wBWG01MlfpV7mZemBLx6ezgLp1cdk",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "govermentvault.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "govermentvault",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "govermentvault.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102753151068686475143",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:102753151068686475143:web:9c99ec00dcf5c6a683ed1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DEMO_USERS = [
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  }
];

const INITIAL_DEPARTMENTS = [
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_DOCUMENTS = [
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user-dept-admin-002',
    tags: ['Fiscal Policy', 'Budget 2026', 'Finance', 'State Budget'],
    effectiveDate: '2026-08-01'
  }
];

async function seed() {
  console.log('🚀 Seeding Firebase Firestore Database for Project:', firebaseConfig.projectId);
  try {
    for (const u of DEMO_USERS) {
      await setDoc(doc(db, 'users', u.uid), u, { merge: true });
      console.log(` ✅ Seeded User: ${u.officialEmail} (${u.role})`);
    }
    for (const d of INITIAL_DEPARTMENTS) {
      await setDoc(doc(db, 'departments', d.id), d, { merge: true });
      console.log(` ✅ Seeded Department: ${d.name}`);
    }
    for (const docItem of INITIAL_DOCUMENTS) {
      await setDoc(doc(db, 'documents', docItem.id), docItem, { merge: true });
      console.log(` ✅ Seeded Document: ${docItem.documentNumber}`);
    }
    console.log('\n🎉 SUCCESS: All initial collections successfully written to Firebase Firestore!');
  } catch (err) {
    console.error('\n❌ FIRESTORE SEED ERROR:', err);
  }
}

seed();
