import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AppointmentList from './AppointmentList';
import BookAppointment from './BookAppointment';
import HODDashboard from './HODDashboard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentCreated = () => {
    setShowBookForm(false);
    fetchAppointments();
  };

  const handleAppointmentUpdated = () => {
    fetchAppointments();
  };

  if (user?.role === 'hod') {
    return <HODDashboard appointments={appointments} loading={loading} onUpdate={handleAppointmentUpdated} />;
  }

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const approvedCount = appointments.filter(a => a.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-0 gap-3 sm:gap-0 min-h-[64px] sm:h-16">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900">HOD Appointment System</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-sm text-gray-600 mb-2">Total Appointments</p>
            <p className="text-3xl font-semibold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-sm text-gray-600 mb-2">Pending</p>
            <p className="text-3xl font-semibold text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-sm text-gray-600 mb-2">Approved</p>
            <p className="text-3xl font-semibold text-green-600">{approvedCount}</p>
          </div>
        </div>

        {/* Header with Book Button */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">My Appointments</h2>
            <p className="text-sm text-gray-600">Manage and track your appointment requests</p>
          </div>
          <button
            onClick={() => setShowBookForm(!showBookForm)}
            className="px-6 py-2.5 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            {showBookForm ? 'Cancel' : 'Book New Appointment'}
          </button>
        </div>

        {/* Book Appointment Form */}
        {showBookForm && (
          <div className="mb-8">
            <BookAppointment onSuccess={handleAppointmentCreated} />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading appointments...</p>
          </div>
        ) : (
          <AppointmentList 
            appointments={appointments} 
            onUpdate={handleAppointmentUpdated}
            isStudent={true}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
