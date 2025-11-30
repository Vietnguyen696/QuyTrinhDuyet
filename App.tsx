
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { StatusBadge } from './components/StatusBadge';
import { DetailModal } from './components/DetailModal';
import { RewardModal } from './components/RewardModal'; // Import specific modal
import { PROCESS_LIST, INITIAL_DATA } from './constants';
import { ViewMode, ProcessType, Status, RecordItem, TabOption, ApprovalInfo } from './types';
import { ChevronRight, ChevronLeft, Plus, Ban } from 'lucide-react';

const PAGE_SIZE = 10;

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.REGISTER);
  const [selectedProcessId, setSelectedProcessId] = useState<ProcessType>(ProcessType.REWARD);
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('TOTAL');
  const [data, setData] = useState<RecordItem[]>(INITIAL_DATA);
  
  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Derived Values
  const selectedProcess = PROCESS_LIST.find(p => p.id === selectedProcessId)!;
  const isTwoLevel = selectedProcess.levels === 2;

  // Filter Data based on Process Type
  const processData = useMemo(() => {
    return data.filter(item => item.type === selectedProcessId);
  }, [data, selectedProcessId]);

  // Generate Status Tabs dynamically based on levels and view mode
  const statusTabs: TabOption[] = useMemo(() => {
    const baseTabs = [
      { 
        id: 'TOTAL', 
        label: 'Tất cả', 
        count: processData.length,
        filter: () => true 
      }
    ];

    let tabs: TabOption[] = [];

    if (!isTwoLevel) {
      // 1 Level Process
      tabs = [
        ...baseTabs,
        { id: 'WAITING', label: 'Chờ phê duyệt', count: processData.filter(d => d.status === Status.WAITING).length, filter: (s) => s === Status.WAITING },
        { id: 'APPROVED', label: 'Đã duyệt', count: processData.filter(d => d.status === Status.APPROVED).length, filter: (s) => s === Status.APPROVED },
        { id: 'REJECTED', label: 'Từ chối', count: processData.filter(d => d.status === Status.REJECTED).length, filter: (s) => s === Status.REJECTED },
        { id: 'CANCELLED', label: 'Đã hủy', count: processData.filter(d => d.status === Status.CANCELLED).length, filter: (s) => s === Status.CANCELLED },
      ];
    } else {
      // 2 Level Process
      tabs = [
        ...baseTabs,
        { id: 'WAITING_L1', label: 'Chờ phê duyệt cấp 1', count: processData.filter(d => d.status === Status.WAITING_L1).length, filter: (s) => s === Status.WAITING_L1 },
        { id: 'WAITING_L2', label: 'Chờ phê duyệt cấp 2', count: processData.filter(d => d.status === Status.WAITING_L2).length, filter: (s) => s === Status.WAITING_L2 },
        { id: 'APPROVED', label: 'Đã duyệt', count: processData.filter(d => d.status === Status.APPROVED).length, filter: (s) => s === Status.APPROVED },
        { id: 'REJECTED_L1', label: 'Từ chối cấp 1', count: processData.filter(d => d.status === Status.REJECTED_L1).length, filter: (s) => s === Status.REJECTED_L1 },
        { id: 'REJECTED_L2', label: 'Từ chối cấp 2', count: processData.filter(d => d.status === Status.REJECTED_L2).length, filter: (s) => s === Status.REJECTED_L2 },
        { id: 'CANCELLED', label: 'Đã hủy', count: processData.filter(d => d.status === Status.CANCELLED).length, filter: (s) => s === Status.CANCELLED },
      ];
    }

    // Hide 'CANCELLED' tab in Approval Mode
    if (viewMode === ViewMode.APPROVAL) {
      return tabs.filter(t => t.id !== 'CANCELLED');
    }

    return tabs;
  }, [processData, isTwoLevel, viewMode]);

  // Filter Data based on Selected Status Tab
  const filteredData = useMemo(() => {
    const currentTab = statusTabs.find(t => t.id === selectedStatusTab);
    if (!currentTab) return processData;
    if (!statusTabs.some(t => t.id === selectedStatusTab)) {
        return processData;
    }
    return processData.filter(item => currentTab.filter(item.status));
  }, [processData, selectedStatusTab, statusTabs]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Helper to create approval info object
  const createApprovalInfo = (comment: string, result: 'APPROVED' | 'REJECTED'): ApprovalInfo => {
      const today = new Date();
      return {
          approverName: "Nguyễn Văn A (Tôi)",
          approverRole: "Cán bộ quản lý",
          actionDate: `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`,
          comment: comment || (result === 'APPROVED' ? "Đồng ý" : "Không đạt yêu cầu"),
          result: result
      };
  };

  // Actions
  const handleApprove = (id: string, comment: string = '') => {
    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const newInfo = createApprovalInfo(comment, 'APPROVED');

      // Logic for multi-level approval
      if (isTwoLevel && item.status === Status.WAITING_L1) {
        return { 
            ...item, 
            status: Status.WAITING_L2,
            level1Result: newInfo
        }; 
      }
      
      // Final approval (Either from WAITING or WAITING_L2)
      if (isTwoLevel && item.status === Status.WAITING_L2) {
          return {
              ...item,
              status: Status.APPROVED,
              level2Result: newInfo
          }
      }

      // Single Level
      return { 
          ...item, 
          status: Status.APPROVED,
          level1Result: newInfo
      }; 
    }));
    
    // Close modal if open
    setSelectedRecord(null);
  };

  const handleReject = (id: string, comment: string = '') => {
    if (!comment.trim()) {
        alert("Vui lòng nhập lý do từ chối");
        return;
    }

    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const newInfo = createApprovalInfo(comment, 'REJECTED');

      if (isTwoLevel && item.status === Status.WAITING_L1) {
          return { ...item, status: Status.REJECTED_L1, level1Result: newInfo };
      }
      if (isTwoLevel && item.status === Status.WAITING_L2) {
          return { ...item, status: Status.REJECTED_L2, level2Result: newInfo };
      }
      return { ...item, status: Status.REJECTED, level1Result: newInfo };
    }));

    setSelectedRecord(null);
  };

  const handleCancel = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: Status.CANCELLED } : item));
  };

  const handleCreateNew = () => {
    if (selectedProcessId === ProcessType.REWARD) {
       setIsCreateModalOpen(true);
    } else {
       // Placeholder for other processes
       alert("Tính năng đang phát triển cho quy trình này");
    }
  };

  // Helper to determine tab styling based on status ID
  const getTabStyles = (tabId: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    if (tabId === 'TOTAL') return 'bg-blue-100 text-blue-700';
    if (tabId.includes('APPROVED')) return 'bg-green-100 text-green-700';
    if (tabId === 'WAITING' || tabId === 'WAITING_L1') return 'bg-[#FFF9E6] text-[#FFB020] border border-[#FFE6A5]';
    if (tabId === 'WAITING_L2') return 'bg-[#FFF0D1] text-[#F59E0B] border border-[#FFD699]'; 
    if (tabId.includes('REJECTED') || tabId.includes('CANCELLED')) return 'bg-red-100 text-red-700';
    return 'bg-blue-100 text-blue-700';
  };

  const getTabCountStyles = (tabId: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-gray-200 text-gray-500';
    if (tabId === 'TOTAL') return 'bg-white text-blue-600';
    if (tabId.includes('APPROVED')) return 'bg-white text-green-600';
    if (tabId === 'WAITING' || tabId === 'WAITING_L1') return 'bg-white text-[#FFB020]';
    if (tabId === 'WAITING_L2') return 'bg-white text-[#F59E0B]';
    if (tabId.includes('REJECTED') || tabId.includes('CANCELLED')) return 'bg-white text-red-600';
    return 'bg-white text-blue-600';
  };

  // Render Table Header based on Process Type
  const renderTableHeader = () => {
      if (selectedProcessId === ProcessType.REWARD) {
          // 0-11 columns as requested
          return (
              <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" onClick={(e) => e.stopPropagation()} />
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Trạng thái</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Mã ĐV</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Họ tên</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Chức vụ</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Chi bộ</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Số QĐ</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Cơ quan QĐ</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Hình thức</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Nội dung</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Năm</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Ngày gửi</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Ghi chú</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap sticky right-0 bg-gray-50/50 text-right">Thao tác</th>
              </tr>
          );
      }
      
      // Default Header for other processes
      return (
        <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-5 w-14 text-center">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" onClick={(e) => e.stopPropagation()} />
            </th>
            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã hồ sơ</th>
            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Người yêu cầu</th>
            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Lý do</th>
            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider w-64 text-right">Thao tác</th>
        </tr>
      );
  };

  // Render Table Row based on Process Type
  const renderTableRow = (item: RecordItem) => {
      const commonActionButtons = (
        <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
            {viewMode === ViewMode.APPROVAL && (
            (item.status === Status.WAITING || item.status === Status.WAITING_L1 || item.status === Status.WAITING_L2) ? (
                <>
                <button 
                    onClick={() => setSelectedRecord(item)}
                    className="flex items-center px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-100 border border-green-200 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                    Xác nhận
                </button>
                <button 
                    onClick={() => setSelectedRecord(item)}
                    className="flex items-center px-4 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 border border-red-200 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                    Từ chối
                </button>
                </>
            ) : (
                <span className="text-sm text-gray-400 italic px-2">Đã xử lý</span>
            )
            )}

            {viewMode === ViewMode.REGISTER && (
            (item.status === Status.WAITING || item.status === Status.WAITING_L1 || item.status === Status.WAITING_L2) ? (
                <button 
                onClick={() => handleCancel(item.id)}
                className="px-5 py-2 text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg text-sm font-semibold transition-all shadow-sm bg-white whitespace-nowrap"
                >
                Hủy bỏ
                </button>
            ) : (
                <span className="text-sm text-gray-400 italic px-2">--</span>
            )
            )}
        </div>
      );

      if (selectedProcessId === ProcessType.REWARD) {
          return (
            <tr 
                key={item.id} 
                className="hover:bg-gray-50 transition-colors group cursor-pointer text-sm"
                onClick={() => setSelectedRecord(item)}
            >
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                </td>
                <td className="p-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                <td className="p-4 whitespace-nowrap font-medium text-blue-600">{item.targetMemberCode}</td>
                <td className="p-4 whitespace-nowrap font-medium text-gray-800">{item.targetMemberName}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{item.targetMemberRole}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{item.targetMemberBranch}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{item.decisionNumber}</td>
                <td className="p-4 whitespace-nowrap text-gray-600 truncate max-w-[150px]" title={item.decisionAgency}>{item.decisionAgency}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{item.rewardType}</td>
                <td className="p-4 whitespace-nowrap text-gray-600 truncate max-w-[150px]" title={item.rewardContent}>{item.rewardContent}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{item.rewardYear}</td>
                <td className="p-4 whitespace-nowrap text-gray-600">{item.date}</td>
                <td className="p-4 whitespace-nowrap text-gray-600 truncate max-w-[100px]">{item.rewardNote}</td>
                <td className="p-4 whitespace-nowrap sticky right-0 bg-white group-hover:bg-gray-50 text-right shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.05)]" onClick={(e) => e.stopPropagation()}>
                    {commonActionButtons}
                </td>
            </tr>
          );
      }

      // Default Row
      return (
        <tr 
            key={item.id} 
            className="hover:bg-gray-50 transition-colors group cursor-pointer"
            onClick={() => setSelectedRecord(item)}
        >
            <td className="p-5 text-center" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
            </td>
            <td className="p-5">
            <StatusBadge status={item.status} />
            </td>
            <td className="p-5 text-sm text-gray-500">{item.id}</td>
            <td className="p-5 text-sm text-gray-600">
            {item.date}
            </td>
            <td className="p-5 text-sm font-semibold text-gray-800">
                {item.applicant}
            </td>
            <td className="p-5 text-sm text-gray-600 max-w-xs truncate">{item.summary}</td>
            <td className="p-5 text-right" onClick={(e) => e.stopPropagation()}>
                {commonActionButtons}
            </td>
        </tr>
      );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col text-[#333]">
      <Header 
        title="Cổng thông tin Đảng viên" 
        currentView={viewMode}
        onChangeView={(mode) => {
            setViewMode(mode);
            setSelectedStatusTab('TOTAL');
            setCurrentPage(1);
            setSelectedRecord(null);
        }}
      />
      
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-6">
        <div className="mb-6 flex justify-between items-center h-10">
           <h2 className="text-2xl font-bold text-gray-800">
             {viewMode === ViewMode.REGISTER ? "Đăng ký yêu cầu" : "Phê duyệt hồ sơ"}
           </h2>
           {viewMode === ViewMode.REGISTER && (
              <button 
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md shadow-blue-200 transition-all active:scale-95"
              >
                <Plus size={18} className="mr-2" />
                Tạo mới yêu cầu
              </button>
           )}
        </div>

        {/* Top Level Process Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100">
            {PROCESS_LIST.map(process => (
              <button
                key={process.id}
                onClick={() => {
                  setSelectedProcessId(process.id);
                  setSelectedStatusTab('TOTAL');
                  setCurrentPage(1);
                }}
                className={`
                  px-6 py-5 whitespace-nowrap text-sm font-medium transition-all relative
                  ${selectedProcessId === process.id 
                    ? 'text-blue-600 bg-blue-50/30' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                {process.label}
                {selectedProcessId === process.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Sub Level Status Tabs */}
          <div className="px-6 py-4 bg-white flex flex-wrap gap-3 items-center border-b border-gray-100">
              {statusTabs.map(tab => (
                <button
                key={tab.id}
                onClick={() => {
                  setSelectedStatusTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2
                  ${getTabStyles(tab.id, selectedStatusTab === tab.id)}
                `}
                >
                  <span>{tab.label}</span>
                  <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${getTabCountStyles(tab.id, selectedStatusTab === tab.id)}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-b-xl shadow-sm min-h-[500px] flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {renderTableHeader()}
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => renderTableRow(item))
                ) : (
                  <tr>
                    <td colSpan={selectedProcessId === ProcessType.REWARD ? 14 : 7} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Ban size={64} className="mb-4 opacity-20" />
                          <p className="text-base font-medium">Không có dữ liệu cho trạng thái này</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
           {/* Pagination */}
           <div className="mt-auto p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 rounded-b-xl">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Hiển thị</span>
                <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 shadow-sm">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <span className="text-sm text-gray-500">/ Tổng {filteredData.length} dòng</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-gray-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg hover:bg-white text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
          </div>
        </div>
      </main>

      {/* Render Specific Modal for Reward */}
      {((selectedRecord && selectedRecord.type === ProcessType.REWARD) || (isCreateModalOpen && selectedProcessId === ProcessType.REWARD)) && (
          <RewardModal 
            record={selectedRecord || undefined} // If creating, this is undefined
            viewMode={viewMode}
            onClose={() => {
                setSelectedRecord(null);
                setIsCreateModalOpen(false);
            }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}

      {/* Render Default Detail Modal for other processes */}
      {selectedRecord && selectedRecord.type !== ProcessType.REWARD && (
          <DetailModal 
            record={selectedRecord}
            viewMode={viewMode}
            onClose={() => setSelectedRecord(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
      )}
    </div>
  );
};

export default App;
