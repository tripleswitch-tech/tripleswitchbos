import { Classification, FormStatus, UserRole, DocumentEntity, FormSubmission, User, UserStatus } from './types';

export const CURRENT_USER: User = {
  id: "u1",
  name: "Alex Miller",
  email: "alex.miller@tripleswitch.com",
  role: UserRole.COMPLIANCE_OFFICER, // Change this to UserRole.BREWER to test restricted access
  status: UserStatus.ACTIVE,
  avatarUrl: "https://picsum.photos/seed/alex/100/100",
  lastActive: "Now"
};

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Alex Miller",
    email: "alex.miller@tripleswitch.com",
    role: UserRole.COMPLIANCE_OFFICER,
    status: UserStatus.ACTIVE,
    avatarUrl: "https://picsum.photos/seed/alex/100/100",
    lastActive: "Now"
  },
  {
    id: "u2",
    name: "Sarah Jenkins",
    email: "sarah.j@tripleswitch.com",
    role: UserRole.OWNER,
    status: UserStatus.ACTIVE,
    avatarUrl: "https://picsum.photos/seed/sarah/100/100",
    lastActive: "2 hours ago"
  },
  {
    id: "u3",
    name: "Dave Grohl",
    email: "dave@tripleswitch.com",
    role: UserRole.BREWERY_MANAGER,
    status: UserStatus.ACTIVE,
    avatarUrl: "https://picsum.photos/seed/dave/100/100",
    lastActive: "5 mins ago"
  },
  {
    id: "u4",
    name: "Mike Ross",
    email: "mike.r@tripleswitch.com",
    role: UserRole.BREWER,
    status: UserStatus.ACTIVE,
    avatarUrl: "https://picsum.photos/seed/mike/100/100",
    lastActive: "1 day ago"
  },
  {
    id: "u5",
    name: "New Hire",
    email: "temp.hire@tripleswitch.com",
    role: UserRole.BREWER,
    status: UserStatus.INVITED,
    avatarUrl: "https://via.placeholder.com/100",
    lastActive: "Never"
  }
];

export const RECENT_DOCUMENTS: DocumentEntity[] = [
  {
    id: "doc-001",
    name: "Q4_Financial_Report_2024.pdf",
    type: "PDF",
    classification: Classification.RESTRICTED,
    size: "2.4 MB",
    uploadedAt: "2024-12-15",
    author: "Sarah Jenkins (CFO)",
    tags: ["Finance", "Q4", "2024"],
    currentVersion: "v2.0",
    versions: [
      { id: "v2", versionNumber: "v2.0", uploadedAt: "2024-12-15", uploadedBy: "Sarah Jenkins (CFO)", fileSize: "2.4 MB", changeNote: "Final audited figures" },
      { id: "v1", versionNumber: "v1.0", uploadedAt: "2024-12-10", uploadedBy: "Sarah Jenkins (CFO)", fileSize: "2.2 MB", changeNote: "Initial draft for review" }
    ]
  },
  {
    id: "doc-002",
    name: "Hop_Contract_Yakima_Valley.pdf",
    type: "PDF",
    classification: Classification.CONFIDENTIAL,
    size: "1.1 MB",
    uploadedAt: "2025-01-10",
    author: "Mike Ross (Ops)",
    tags: ["Supply Chain", "Contracts", "Hops"],
    currentVersion: "v1.0",
    versions: [
      { id: "v1", versionNumber: "v1.0", uploadedAt: "2025-01-10", uploadedBy: "Mike Ross (Ops)", fileSize: "1.1 MB", changeNote: "Signed contract" }
    ]
  },
  {
    id: "doc-003",
    name: "SOP_Tank_Cleaning_v2.docx",
    type: "DOCX",
    classification: Classification.INTERNAL,
    size: "450 KB",
    uploadedAt: "2025-01-12",
    author: "Dave Grohl (Head Brewer)",
    tags: ["SOP", "Safety", "Production"],
    currentVersion: "v2.1",
    versions: [
      { id: "v3", versionNumber: "v2.1", uploadedAt: "2025-01-12", uploadedBy: "Dave Grohl", fileSize: "450 KB", changeNote: "Updated caustic cycle times" },
      { id: "v2", versionNumber: "v2.0", uploadedAt: "2024-11-05", uploadedBy: "Dave Grohl", fileSize: "445 KB", changeNote: "Added safety protocol appendix" },
      { id: "v1", versionNumber: "v1.0", uploadedAt: "2024-06-20", uploadedBy: "Mike Ross", fileSize: "400 KB", changeNote: "Original SOP creation" }
    ]
  },
  {
    id: "doc-004",
    name: "Taproom_Menu_Spring_2025.pdf",
    type: "PDF",
    classification: Classification.PUBLIC,
    size: "5.2 MB",
    uploadedAt: "2025-01-20",
    author: "Marketing Team",
    tags: ["Marketing", "Retail", "Spring"],
    currentVersion: "v1.2",
    versions: [
      { id: "v2", versionNumber: "v1.2", uploadedAt: "2025-01-20", uploadedBy: "Marketing Team", fileSize: "5.2 MB", changeNote: "Price adjustments" },
      { id: "v1", versionNumber: "v1.0", uploadedAt: "2025-01-18", uploadedBy: "Marketing Team", fileSize: "5.1 MB", changeNote: "Initial layout" }
    ]
  },
  {
    id: "doc-005",
    name: "Production_Schedule_Q1.xlsx",
    type: "XLSX",
    classification: Classification.INTERNAL,
    size: "850 KB",
    uploadedAt: "2025-01-22",
    author: "Mike Ross",
    tags: ["Production", "Schedule", "Planning"],
    currentVersion: "v1.0",
    versions: [
      { id: "v1", versionNumber: "v1.0", uploadedAt: "2025-01-22", uploadedBy: "Mike Ross", fileSize: "850 KB", changeNote: "Baseline Q1 Schedule" }
    ]
  }
];

export const MOCK_FORMS: FormSubmission[] = [
  {
    id: "sub-101",
    name: "Jan 2025 TTB Report",
    templateName: "TTB F 5130.9",
    status: FormStatus.PENDING_APPROVAL,
    submittedBy: "Dave Grohl",
    submittedAt: "2025-02-01",
    classification: Classification.RESTRICTED,
    riskLevel: 'HIGH',
    fields: []
  },
  {
    id: "sub-102",
    name: "Batch #452 Quality Log",
    templateName: "Quality Control Sheet",
    status: FormStatus.APPROVED,
    submittedBy: "Mike Ross",
    submittedAt: "2025-01-28",
    classification: Classification.INTERNAL,
    riskLevel: 'LOW',
    fields: []
  }
];

export const MOCK_SMART_FILL_FIELDS = [
  { id: "f1", label: "Business Name", value: "Tripleswitch Brewing Company, LLC", confidence: 0.99, isEdited: false, required: true },
  { id: "f2", label: "Registry Number", value: "BW-CA-59512", confidence: 0.98, isEdited: false, required: true },
  { id: "f3", label: "Period", value: "January 2025", confidence: 0.85, isEdited: false, required: true },
  { id: "f4", label: "Total Production (Bbls)", value: "450.5", confidence: 0.65, isEdited: false, required: true, originalValue: "450" }, // Low confidence example
  { id: "f5", label: "Tax Due ($)", value: "1,245.00", confidence: 0.95, isEdited: false, required: true },
  { id: "f6", label: "Authorized Signature", value: "[PENDING_SIGNATURE]", confidence: 1.0, isEdited: false, required: true },
];

export const DASHBOARD_METRICS = [
  { label: "Compliance Score", value: "98%", trend: 2.4, trendLabel: "vs last month" },
  { label: "Pending Approvals", value: 3, trend: -1, trendLabel: "from yesterday" },
  { label: "Docs Ingested", value: 142, trend: 12, trendLabel: "this week" },
  { label: "Kb Entities", value: 1254, trend: 5, trendLabel: "new entities" }
];