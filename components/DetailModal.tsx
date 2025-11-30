import React, { useState } from 'react';
import { X, CheckCircle, XCircle, User, Calendar, MessageSquare, Briefcase, FileText } from 'lucide-react';
import { RecordItem, Status, ViewMode, ApprovalInfo } from '../types';
import { StatusBadge } from './StatusBadge';

interface DetailModalProps {
  record: RecordItem;
  viewMode: ViewMode;
  onClose: () => void;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  record, 
  viewMode, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  const [comment, setComment] = useState('');

  // Determine if the current user (in Approval Mode) can act on this record
  const canAct = viewMode === ViewMode.APPROVAL && 
    (record.status === Status.WAITING || 
     record.status === Status.WAITING_L1 || 
     record.status === Status.WAITING_L2);

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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">Chi tiết hồ sơ</h3>
                <p className="text-xs text-gray-500 font-mono">{record.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* General Information */}
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Thông tin chung</h4>
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Người yêu cầu</label>
                    <div className="text-gray-900 font-semibold">{record.applicant}</div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ngày gửi</label>
                    <div className="text-gray-900 font-medium">{record.date}</div>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Loại quy trình</label>
                    <div className="text-blue-700 font-medium bg-blue-50/50 inline-block px-2 py-0.5 rounded">{record.type}</div>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nội dung / Lý do</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm leading-relaxed border border-gray-100">
                        {record.summary}
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Trạng thái hiện tại</label>
                    <div><StatusBadge status={record.status} /></div>
                </div>
            </div>
          </section>

          {/* Approval History Section */}
          {(record.level1Result || record.level2Result) && (
             <section className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-4">
                    Lịch sử phê duyệt
                </h4>
                <div className="space-y-4">
                    <ApprovalHistoryItem title="Cấp 1" info={record.level1Result} />
                    <ApprovalHistoryItem title="Cấp 2" info={record.level2Result} />
                </div>
             </section>
          )}

          {/* Approver Input Section */}
          {canAct && (
             <section className="pt-2 border-t border-gray-100">
                <h4 className="text-sm font-bold text-blue-800 mb-4 mt-4 flex items-center">
                    <Briefcase size={16} className="mr-2"/>
                    Thông tin xử lý (Dành cho người duyệt)
                </h4>
                
                <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-100">
                    {/* Simulated Approver Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Người duyệt</label>
                            <input type="text" disabled value="Nguyễn Văn A (Tôi)" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Chức vụ</label>
                            <input type="text" disabled value="Cán bộ quản lý" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm" />
                        </div>
                    </div>

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
                </div>
             </section>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
                Đóng
            </button>
            
            {canAct && (
                <>
                    <button 
                        onClick={() => onReject(record.id, comment)}
                        className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center"
                    >
                        <XCircle size={16} className="mr-2" />
                        Từ chối
                    </button>
                    <button 
                        onClick={() => onApprove(record.id, comment)}
                        className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-md shadow-green-200 transition-all active:scale-95 flex items-center"
                    >
                        <CheckCircle size={16} className="mr-2" />
                        Xác nhận
                    </button>
                </>
            )}
        </div>

      </div>
    </div>
  );
};