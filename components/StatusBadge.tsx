import React from 'react';
import { Status } from '../types';

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const getStyles = (s: Status) => {
    switch (s) {
      case Status.APPROVED:
        // Green for Approved
        return 'bg-green-50 text-green-700 border border-green-200';
      
      case Status.WAITING:
      case Status.WAITING_L1:
        // Light Yellow for Level 1 / General Waiting
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      
      case Status.WAITING_L2:
        // Distinct Darker Amber for Level 2 to show higher urgency/progression
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      
      case Status.REJECTED:
      case Status.REJECTED_L1:
      case Status.REJECTED_L2:
      case Status.CANCELLED:
        // Red for Rejected and Cancelled
        return 'bg-red-50 text-red-700 border border-red-200';
        
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getDotColor = (s: Status) => {
    switch (s) {
      case Status.APPROVED: return 'bg-green-500';
      
      case Status.WAITING: 
      case Status.WAITING_L1: return 'bg-yellow-400'; // Brighter yellow dot
      case Status.WAITING_L2: return 'bg-amber-600'; // Darker amber dot
      
      case Status.REJECTED:
      case Status.REJECTED_L1:
      case Status.REJECTED_L2:
      case Status.CANCELLED: return 'bg-red-500';
      
      default: return 'bg-gray-400';
    }
  };

  const getLabel = (s: Status) => {
    switch (s) {
      case Status.WAITING: return 'Chờ phê duyệt';
      case Status.WAITING_L1: return 'Chờ phê duyệt cấp 1';
      case Status.WAITING_L2: return 'Chờ phê duyệt cấp 2';
      case Status.APPROVED: return 'Đã duyệt';
      case Status.REJECTED: return 'Từ chối';
      case Status.REJECTED_L1: return 'Từ chối cấp 1';
      case Status.REJECTED_L2: return 'Từ chối cấp 2';
      case Status.CANCELLED: return 'Đã hủy';
      default: return s;
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStyles(status)}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${getDotColor(status)}`}></span>
      {getLabel(status)}
    </span>
  );
};