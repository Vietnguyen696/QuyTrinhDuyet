
import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Plus, Trash2, Upload, Calendar, Search, User, Briefcase, MessageSquare } from 'lucide-react';
import { RecordItem, Status, ViewMode, PartyMember, ApprovalInfo } from '../types';

interface RewardModalProps {
  record?: RecordItem;
  viewMode: ViewMode;
  onClose: () => void;
  onApprove?: (id: string, comment: string) => void;
  onReject?: (id: string, comment: string) => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({ 
  record, 
  viewMode, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');
  
  const isCreate = !record || !record.id;
  const canAct = !isCreate && viewMode === ViewMode.APPROVAL && 
    (record?.status === Status.WAITING || record?.status === Status.WAITING_L1);

  // Form State
  const [formData, setFormData] = useState({
      rewardYear: record?.rewardYear || '2025',
      decisionNumber: record?.decisionNumber || '',
      decisionAgency: record?.decisionAgency || '',
      rewardType: record?.rewardType || '',
      signDate: record?.signDate || '',
      rewardContent: record?.rewardContent || '',
      rewardNote: record?.rewardNote || ''
  });

  // Mock Member List
  const [members, setMembers] = useState<PartyMember[]>(record?.memberList || []);

  const inputClass = "w-full bg-[#FFF9E6] border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-colors placeholder-gray-400";
  const readOnlyClass = "w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  // Approval History Component
  const ApprovalHistoryItem = ({ title, info }: { title: string, info?: ApprovalInfo }) => {
    if (!info) return null;
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-100">
        <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase border-b border-gray-200 pb-1 flex justify-between items-center">
            {title}
            {info.result === 'APPROVED' ? (
                <span className="text-green-600 text-xs flex items-center font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100"><CheckCircle size={12} className="mr-1"/> Đồng ý</span>
            ) : (
                <span className="text-red-600 text-xs flex items-center font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100"><XCircle size={12} className="mr-1"/> Từ chối</span>
            )}
        </h4>
        <div className="grid grid-cols-2 gap-y-3 text-sm mt-3">
          <div className="col-span-1">
             <div className="text-xs text-gray-500 mb-0.5 flex items-center"><User size={12} className="mr-1"/> Người duyệt</div>
             <div className="font-medium text-gray-800">{info.approverName}</div>
          </div>
          <div className="col-span-1">
             <div className="text-xs text-gray-500 mb-0.5 flex items-center"><Briefcase size={12} className="mr-1"/> Chức vụ</div>
             <div className="font-medium text-gray-800">{info.approverRole}</div>
          </div>
          <div className="col-span-1">
             <div className="text-xs text-gray-500 mb-0.5 flex items-center"><Calendar size={12} className="mr-1"/> Ngày duyệt</div>
             <div className="font-medium text-gray-800">{info.actionDate}</div>
          </div>
          <div className="col-span-2 mt-1">
             <div className="text-xs text-gray-500 mb-1 flex items-center"><MessageSquare size={12} className="mr-1"/> Lý do / Ý kiến</div>
             <div className="bg-white p-2 rounded border border-gray-200 text-gray-700 italic text-sm">"{info.comment}"</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
             {isCreate ? "Tạo mới Khen thưởng Đảng viên" : "Chi tiết Khen thưởng Đảng viên"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* Decision Info Section */}
          <section className="mb-8">
            <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 mb-4 uppercase">
                Thông tin quyết định
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {/* Row 1 */}
                <div>
                    <label className={labelClass}>Năm khen thưởng <span className="text-red-500">*</span></label>
                    <input type="text" className={inputClass} value={formData.rewardYear} readOnly={!isCreate} />
                </div>
                <div>
                    <label className={labelClass}>Số quyết định <span className="text-red-500">*</span></label>
                    <input type="text" className={inputClass} value={formData.decisionNumber} readOnly={!isCreate} placeholder="Nhập số quyết định" />
                </div>
                 <div>
                    <label className={labelClass}>Cơ quan/Đơn vị ra quyết định <span className="text-red-500">*</span></label>
                    <select className={inputClass} value={formData.decisionAgency} disabled={!isCreate}>
                        <option value="">-- Chọn đơn vị --</option>
                        <option value="Đảng ủy Khối doanh nghiệp">Đảng ủy Khối doanh nghiệp</option>
                        <option value="Đảng ủy Tập đoàn">Đảng ủy Tập đoàn</option>
                        <option value="Đảng ủy cơ sở">Đảng ủy cơ sở</option>
                    </select>
                </div>

                {/* Row 2 */}
                <div>
                    <label className={labelClass}>Đối tượng</label>
                    <input type="text" className={`${readOnlyClass} bg-gray-100 text-gray-500`} value="Cá nhân" disabled />
                </div>
                <div>
                    <label className={labelClass}>Hình thức/Danh hiệu <span className="text-red-500">*</span></label>
                    <select className={inputClass} value={formData.rewardType} disabled={!isCreate}>
                         <option value="">-- Chọn hình thức --</option>
                         <option value="Biểu dương">Biểu dương</option>
                         <option value="Giấy khen">Giấy khen</option>
                         <option value="Bằng khen">Bằng khen</option>
                         <option value="Huy hiệu 30 năm">Huy hiệu 30 năm</option>
                         <option value="Chiến sĩ thi đua">Chiến sĩ thi đua</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Ngày ký</label>
                    <div className="relative">
                        <input type="text" className={readOnlyClass} value={formData.signDate} readOnly={!isCreate} placeholder="dd/mm/yyyy" />
                        <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                 {/* Row 3 */}
                <div className="col-span-1 md:col-span-3">
                    <label className={labelClass}>Nội dung khen thưởng</label>
                    <input type="text" className={readOnlyClass} value={formData.rewardContent} readOnly={!isCreate} />
                </div>
                
                {/* Row 4 */}
                <div className="col-span-1 md:col-span-3">
                    <label className={labelClass}>Ghi chú</label>
                    <input type="text" className={readOnlyClass} value={formData.rewardNote} readOnly={!isCreate} />
                </div>

                {/* Row 5 - Attachments */}
                <div className="col-span-1 md:col-span-3">
                    <label className={labelClass}>Tập tin đính kèm</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <span className="font-medium text-blue-600 hover:text-blue-500">Tải lên tệp</span>
                                <p className="pl-1">hoặc kéo thả vào đây</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                    </div>
                </div>
            </div>
          </section>

          {/* Member List Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-blue-800 border-l-4 border-blue-600 pl-3 uppercase">
                    Danh sách Đảng viên
                </h4>
                {isCreate && (
                    <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 shadow-sm">
                        <Plus size={14} className="mr-1" /> Thêm Đảng viên
                    </button>
                )}
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 w-12 text-center">STT</th>
                            <th className="px-4 py-3">Mã Đảng viên</th>
                            <th className="px-4 py-3">Họ và tên</th>
                            <th className="px-4 py-3">Ngày sinh</th>
                            <th className="px-4 py-3">Chức vụ</th>
                            <th className="px-4 py-3">Chi bộ</th>
                            {isCreate && <th className="px-4 py-3 w-16 text-center">Xóa</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {members.length > 0 ? members.map((mem, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center text-gray-500">{idx + 1}</td>
                                <td className="px-4 py-3 font-medium text-blue-600">{mem.id}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{mem.name}</td>
                                <td className="px-4 py-3 text-gray-600">{mem.dob}</td>
                                <td className="px-4 py-3 text-gray-600">{mem.role}</td>
                                <td className="px-4 py-3 text-gray-600">{mem.branch}</td>
                                {isCreate && (
                                    <td className="px-4 py-3 text-center">
                                        <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 italic">
                                    Chưa có đảng viên nào được chọn
                                </td>
                            </tr>
                        )}
                         {/* Fake Row for Input Simulation if Creating */}
                         {isCreate && members.length === 0 && (
                             <tr className="bg-yellow-50/50">
                                 <td className="px-4 py-3 text-center text-gray-400">1</td>
                                 <td className="px-4 py-2"><div className="flex items-center relative"><input className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-sm py-1" placeholder="Nhập mã..." /><Search size={14} className="absolute right-0 text-gray-400"/></div></td>
                                 <td className="px-4 py-2"><input className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-sm py-1" disabled /></td>
                                 <td className="px-4 py-2"><input className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-sm py-1" disabled /></td>
                                 <td className="px-4 py-2"><input className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-sm py-1" disabled /></td>
                                 <td className="px-4 py-2"><input className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-sm py-1" disabled /></td>
                                 <td className="px-4 py-2"></td>
                             </tr>
                         )}
                    </tbody>
                </table>
            </div>
          </section>

          {/* Approval Action Section (Only visible when approving) */}
          {canAct && (
             <section className="mt-8 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                 <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                    Thông tin xử lý
                 </h4>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ý kiến / Lý do <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white shadow-sm"
                        rows={3}
                        placeholder="Nhập ý kiến phê duyệt hoặc lý do từ chối..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>
             </section>
          )}

          {/* Approval History Display if exists */}
          {(record?.level1Result || record?.level2Result) && (
             <section className="mt-8 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-600 mb-4 uppercase">
                    Lịch sử phê duyệt
                </h4>
                <ApprovalHistoryItem title="Cấp 1" info={record?.level1Result} />
                <ApprovalHistoryItem title="Cấp 2" info={record?.level2Result} />
             </section>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded shadow-sm text-sm font-medium hover:bg-gray-100 transition-colors"
            >
                {isCreate ? "Hủy" : "Đóng"}
            </button>
            
            {isCreate && (
                <button className="px-6 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors">
                    Lưu
                </button>
            )}

            {canAct && onReject && onApprove && (
                <>
                    <button 
                        onClick={() => onReject(record!.id, comment)}
                        className="px-6 py-2 bg-white border border-red-300 text-red-600 rounded shadow-sm text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                        Từ chối
                    </button>
                    <button 
                        onClick={() => onApprove(record!.id, comment)}
                        className="px-6 py-2 bg-green-600 text-white rounded shadow-sm text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                        Xác nhận
                    </button>
                </>
            )}
        </div>

      </div>
    </div>
  );
};
