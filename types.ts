
export enum ViewMode {
  REGISTER = 'REGISTER',
  APPROVAL = 'APPROVAL',
}

export enum ProcessType {
  REWARD = 'REWARD', // Khen thưởng (1 cấp)
  DISCIPLINE = 'DISCIPLINE', // Kỷ luật (1 cấp)
  MEMBER_GRADING = 'MEMBER_GRADING', // Xếp loại ĐV (2 cấp)
  ORG_GRADING = 'ORG_GRADING', // Xếp loại tổ chức (1 cấp)
  CONFIRMATION = 'CONFIRMATION', // Chuẩn y (1 cấp)
  TRANSFER = 'TRANSFER', // Chuyển sinh hoạt (2 cấp)
  ABROAD = 'ABROAD', // Đi nước ngoài (2 cấp)
  SUPPLEMENTARY = 'SUPPLEMENTARY', // Bổ sung thông tin (1 cấp)
}

export enum Status {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  
  // Level 1 specific
  WAITING_L1 = 'WAITING_L1',
  REJECTED_L1 = 'REJECTED_L1',
  
  // Level 2 specific
  WAITING_L2 = 'WAITING_L2',
  REJECTED_L2 = 'REJECTED_L2',
}

export interface ProcessConfig {
  id: ProcessType;
  label: string;
  levels: 1 | 2;
}

export interface ApprovalInfo {
  approverName: string;
  approverRole: string;
  actionDate: string;
  comment: string;
  result: 'APPROVED' | 'REJECTED';
}

export interface PartyMember {
  id: string;
  name: string;
  role: string;
  branch: string;
  dob: string;
}

export interface RecordItem {
  id: string;
  date: string;
  applicant: string;
  type: ProcessType;
  status: Status;
  summary: string; 
  startTime?: string;
  endTime?: string;
  
  // Specific fields for Reward (Khen thưởng)
  rewardYear?: string;
  decisionNumber?: string;
  decisionAgency?: string;
  rewardType?: string; // Hình thức/Danh hiệu
  rewardContent?: string; // Nội dung
  rewardNote?: string;
  signDate?: string;
  
  // Target Member Info (Single member focus for the grid view)
  targetMemberCode?: string;
  targetMemberName?: string;
  targetMemberRole?: string;
  targetMemberBranch?: string;

  // List of members attached to this request (for the modal)
  memberList?: PartyMember[];

  // History of approvals
  level1Result?: ApprovalInfo;
  level2Result?: ApprovalInfo;
}

export interface TabOption {
  id: string;
  label: string;
  count: number;
  filter: (status: Status) => boolean;
}
