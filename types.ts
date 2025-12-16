
export enum Classification {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED'
}

export enum UserRole {
  OWNER = 'OWNER',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  BREWERY_MANAGER = 'BREWERY_MANAGER',
  BREWER = 'BREWER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  INVITED = 'INVITED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
  lastActive: string;
}

export enum FormStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface DocumentVersion {
  id: string;
  versionNumber: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  changeNote: string;
}

export interface DocumentEntity {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'IMG';
  classification: Classification;
  size: string;
  uploadedAt: string;
  author: string;
  tags: string[];
  currentVersion: string;
  versions: DocumentVersion[];
}

export interface FormField {
  id: string;
  label: string;
  value: string;
  originalValue?: string; // For comparison
  confidence: number; // 0 to 1
  isEdited: boolean;
  required: boolean;
}

export interface FormSubmission {
  id: string;
  name: string;
  templateName: string;
  status: FormStatus;
  submittedBy: string;
  submittedAt: string;
  classification: Classification;
  fields: FormField[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Metric {
  label: string;
  value: string | number;
  trend: number; // percentage
  trendLabel: string;
}
