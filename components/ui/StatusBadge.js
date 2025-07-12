'use client';

const STATUS_STYLES = {
  received: 'bg-blue-100 text-blue-800',
  viewed: 'bg-purple-100 text-purple-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-orange-100 text-orange-800'
};

export default function StatusBadge({ status }) {
  const statusClass = STATUS_STYLES[status] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}