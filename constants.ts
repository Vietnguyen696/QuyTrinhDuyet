
import { ProcessConfig, ProcessType, RecordItem, Status } from "./types";

export const PROCESS_LIST: ProcessConfig[] = [
  { id: ProcessType.REWARD, label: "Khen thưởng Đảng viên", levels: 1 },
  { id: ProcessType.DISCIPLINE, label: "Kỷ luật Đảng viên", levels: 1 },
  { id: ProcessType.MEMBER_GRADING, label: "Xếp loại Đảng viên", levels: 2 },
  { id: ProcessType.ORG_GRADING, label: "Xếp loại tổ chức Đảng", levels: 1 },
  { id: ProcessType.CONFIRMATION, label: "Công tác chuẩn y", levels: 1 },
  { id: ProcessType.TRANSFER, label: "Chuyển sinh hoạt Đảng", levels: 2 },
  { id: ProcessType.ABROAD, label: "Đi nước ngoài", levels: 2 },
  { id: ProcessType.SUPPLEMENTARY, label: "Phiếu bổ sung thông tin", levels: 1 },
];

// Helper to generate dates in dd/MM/yyyy format
const randomDate = (start: Date, end: Date) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const BRANCHES = ["Chi bộ 1", "Chi bộ 2", "Chi bộ Kỹ thuật", "Chi bộ Kinh doanh", "Chi bộ Hành chính"];
const ROLES = ["Đảng viên chính thức", "Đảng viên dự bị", "Bí thư chi bộ", "Phó bí thư"];
const REWARD_TYPES = ["Biểu dương", "Giấy khen", "Bằng khen", "Huy hiệu 30 năm", "Chiến sĩ thi đua"];
const DECISION_AGENCIES = ["Đảng ủy Khối doanh nghiệp", "Đảng ủy Tập đoàn", "Đảng ủy cơ sở"];

// Mock Data Generator
export const generateMockData = (): RecordItem[] => {
  const data: RecordItem[] = [];
  const types = Object.values(ProcessType);
  
  // Weighted statuses to ensure more "Waiting" items for testing
  const statuses1Level = [
    Status.WAITING, Status.WAITING, Status.WAITING, // High chance
    Status.APPROVED, 
    Status.REJECTED, 
    Status.CANCELLED
  ];
  
  const statuses2Level = [
    Status.WAITING_L1, Status.WAITING_L1, Status.WAITING_L1, // High chance L1
    Status.WAITING_L2, Status.WAITING_L2, // Medium chance L2
    Status.APPROVED, 
    Status.REJECTED_L1, 
    Status.REJECTED_L2, 
    Status.CANCELLED
  ];

  for (let i = 1; i <= 60; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const config = PROCESS_LIST.find(p => p.id === type)!;
    
    let status;
    if (config.levels === 1) {
      status = statuses1Level[Math.floor(Math.random() * statuses1Level.length)];
    } else {
      status = statuses2Level[Math.floor(Math.random() * statuses2Level.length)];
    }

    const item: RecordItem = {
      id: `REQ-${1000 + i}`,
      date: randomDate(new Date(2025, 0, 1), new Date(2025, 11, 31)),
      applicant: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
      type: type,
      status: status,
      summary: i % 3 === 0 ? "Báo cáo thành tích xuất sắc" : i % 3 === 1 ? "Vi phạm quy chế sinh hoạt" : "Hồ sơ đợt 1 năm 2025",
      startTime: "08:00",
      endTime: "17:00"
    };

    // Specific Data for REWARD type
    if (type === ProcessType.REWARD) {
       item.targetMemberCode = `DV-${2000 + i}`;
       item.targetMemberName = `Đảng viên ${String.fromCharCode(65 + (i % 26))} ${i}`;
       item.targetMemberRole = ROLES[i % ROLES.length];
       item.targetMemberBranch = BRANCHES[i % BRANCHES.length];
       
       item.rewardYear = "2025";
       item.decisionNumber = `${i}/QĐ-KT`;
       item.decisionAgency = DECISION_AGENCIES[i % DECISION_AGENCIES.length];
       item.rewardType = REWARD_TYPES[i % REWARD_TYPES.length];
       item.rewardContent = i % 2 === 0 ? "Hoàn thành xuất sắc nhiệm vụ" : "Đóng góp tích cực phong trào";
       item.signDate = item.date;
       item.rewardNote = i % 5 === 0 ? "Ưu tiên xét duyệt" : "";
       
       // Mock Member List attached
       item.memberList = [
         {
           id: item.targetMemberCode,
           name: item.targetMemberName,
           role: item.targetMemberRole,
           branch: item.targetMemberBranch,
           dob: "01/01/1990"
         }
       ];
    }

    // Simulate History Data based on status
    if (status === Status.WAITING_L2) {
      item.level1Result = {
        approverName: "Lê Thị Bí Thư",
        approverRole: "Bí thư Chi bộ",
        actionDate: item.date, // Same day for simplicity
        comment: "Đã kiểm tra, hồ sơ hợp lệ, chuyển cấp trên phê duyệt.",
        result: 'APPROVED'
      };
    }

    if (status === Status.APPROVED && config.levels === 2) {
      item.level1Result = {
        approverName: "Lê Thị Bí Thư",
        approverRole: "Bí thư Chi bộ",
        actionDate: item.date,
        comment: "Đã kiểm tra, hồ sơ hợp lệ.",
        result: 'APPROVED'
      };
      item.level2Result = {
        approverName: "Trần Văn Đảng Ủy",
        approverRole: "Đảng ủy viên",
        actionDate: item.date,
        comment: "Đồng ý đề xuất khen thưởng.",
        result: 'APPROVED'
      };
    }

    if (status === Status.APPROVED && config.levels === 1) {
      item.level1Result = {
        approverName: "Nguyễn Văn Chủ Tịch",
        approverRole: "Chủ tịch",
        actionDate: item.date,
        comment: "Duyệt theo quy định hiện hành.",
        result: 'APPROVED'
      };
    }
    
    if (status === Status.REJECTED_L1 || status === Status.REJECTED) {
       item.level1Result = {
        approverName: "Nguyễn Văn Chủ Tịch",
        approverRole: "Chủ tịch",
        actionDate: item.date,
        comment: "Hồ sơ thiếu minh chứng.",
        result: 'REJECTED'
      };
    }

    data.push(item);
  }
  
  // Create a specific waiting item for Reward testing
  data.push({ 
      id: 'REQ-2003', 
      date: '01/08/2025', 
      applicant: 'Chi bộ 1', 
      type: ProcessType.REWARD, 
      status: Status.WAITING, 
      summary: 'Đề xuất khen thưởng quý 3',
      
      // Detailed fields
      targetMemberCode: 'DV-9999',
      targetMemberName: 'Phạm Thị Lan',
      targetMemberRole: 'Đảng viên chính thức',
      targetMemberBranch: 'Chi bộ 1',
      rewardYear: '2025',
      decisionNumber: '123/QĐ-UB',
      decisionAgency: 'Đảng ủy Khối doanh nghiệp',
      rewardType: 'Giấy khen',
      rewardContent: 'Thành tích xuất sắc trong công tác dân vận',
      signDate: '25/07/2025',
      rewardNote: 'Đề xuất bổ sung',
      memberList: [
        { id: 'DV-9999', name: 'Phạm Thị Lan', role: 'Đảng viên chính thức', branch: 'Chi bộ 1', dob: '15/05/1985' }
      ]
  });

  return data.sort((a, b) => b.id.localeCompare(a.id));
};

export const INITIAL_DATA = generateMockData();
