import { useAuth } from '../context/AuthContext';
import AppointmentList from './AppointmentList';
import { useState } from 'react';

const HODDashboard = ({ appointments, loading, onUpdate }) => {
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    rejected: appointments.filter(a => a.status === 'rejected').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-0 gap-3 sm:gap-0 min-h-[64px] sm:h-16">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900">HOD Dashboard</h1>
              <p className="text-xs text-gray-500">Computer Science Department</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded border border-gray-300 transition-colors active:bg-gray-100 touch-manipulation whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Appointment Overview</h2>
          <p className="text-sm text-gray-600">Manage all student appointment requests</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4">
            <p className="text-xs text-gray-600 mb-1">Rejected</p>
            <p className="text-2xl font-semibold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white border border-gray-200 rounded p-4 mb-8">
          <p className="text-sm font-medium text-gray-700 mb-3">Filter by Status</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors ${
                filter === 'pending' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors ${
                filter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors ${
                filter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading appointments...</p>
          </div>
        ) : (
          <AppointmentList 
            appointments={filteredAppointments} 
            onUpdate={onUpdate}
            isStudent={false}
          />
        )}
      </div>
    </div>
  );
};

export default HODDashboard;
