import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AppointmentList = ({ appointments, onUpdate, isStudent = false }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [statusForms, setStatusForms] = useState({});
  const [activeStatusId, setActiveStatusId] = useState(null);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
      completed: 'bg-blue-50 text-blue-700 border-blue-200',
      cancelled: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/appointments/${id}`);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment._id);
    setEditForm({
      date: new Date(appointment.date).toISOString().split('T')[0],
      time: appointment.time,
      purpose: appointment.purpose,
      notes: appointment.notes || ''
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, editForm);
      setEditingId(null);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleStatusUpdate = async (id) => {
    const formData = statusForms[id] || { status: '', hodNotes: '' };
    if (!formData.status) return;
    
    try {
      await axios.patch(`${API_URL}/appointments/${id}/status`, formData);
      setStatusForms(prev => {
        const newForms = { ...prev };
        delete newForms[id];
        return newForms;
      });
      setActiveStatusId(null);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const updateStatusForm = (id, field, value) => {
    setStatusForms(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { status: '', hodNotes: '' }),
        [field]: value
      }
    }));
  };

  const getStatusForm = (id) => {
    return statusForms[id] || { status: '', hodNotes: '' };
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded p-12 text-center">
        <p className="text-gray-500 text-sm">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment._id} className="bg-white border border-gray-200 rounded">
          {editingId === appointment._id && isStudent ? (
            <div className="p-6 space-y-4">
              <h4 className="text-base font-semibold text-gray-900 mb-4">Edit Appointment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <textarea
                  value={editForm.purpose}
                  onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleUpdate(appointment._id)}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {isStudent ? 'My Appointment' : appointment.studentName || 'Student'}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                    {!isStudent && (
                      <span>ID: {appointment.studentId || 'N/A'}</span>
                    )}
                    <span>{appointment.studentEmail}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status.toUpperCase()}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(appointment.date)} at {appointment.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Purpose</p>
                  <p className="text-sm text-gray-900">{appointment.purpose}</p>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-xs font-medium text-gray-700 mb-1">Student Notes</p>
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              )}

              {/* HOD Notes */}
              {appointment.hodNotes && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-xs font-medium text-gray-700 mb-1">HOD Notes</p>
                  <p className="text-sm text-gray-600">{appointment.hodNotes}</p>
                </div>
              )}

              {/* HOD Status Update Form */}
              {!isStudent && appointment.status === 'pending' && (
                <div className={`mt-4 p-4 bg-gray-50 border border-gray-200 rounded ${activeStatusId === appointment._id ? 'ring-1 ring-gray-900' : ''}`}>
                  {activeStatusId !== appointment._id ? (
                    <button
                      onClick={() => setActiveStatusId(appointment._id)}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Update Status
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={getStatusForm(appointment._id).status}
                          onChange={(e) => updateStatusForm(appointment._id, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                        >
                          <option value="">Select status</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea
                          value={getStatusForm(appointment._id).hodNotes}
                          onChange={(e) => updateStatusForm(appointment._id, 'hodNotes', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                          rows={2}
                          placeholder="Add notes for the student..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id)}
                          disabled={!getStatusForm(appointment._id).status}
                          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          Update Status
                        </button>
                        <button
                          onClick={() => {
                            setActiveStatusId(null);
                            setStatusForms(prev => {
                              const newForms = { ...prev };
                              delete newForms[appointment._id];
                              return newForms;
                            });
                          }}
                          className="px-4 py-2 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Student Actions */}
              {isStudent && appointment.status === 'pending' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(appointment)}
                    className="px-4 py-2 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(appointment._id)}
                    className="px-4 py-2 bg-white text-red-600 rounded border border-red-300 hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
