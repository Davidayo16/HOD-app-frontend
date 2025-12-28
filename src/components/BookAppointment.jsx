import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const BookAppointment = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    purpose: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setFormData(prev => ({ ...prev, time: '' }));
    }
  }, [formData.date]);

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await axios.get(`${API_URL}/appointments/availability/${formData.date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/appointments`, formData);
      setFormData({ date: '', time: '', purpose: '', notes: '' });
      setAvailableSlots([]);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const availableCount = availableSlots.filter(slot => slot.available).length;

  return (
    <div className="bg-white border border-gray-200 rounded p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Book New Appointment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              required
              min={minDate}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Time *
              {formData.date && availableCount > 0 && (
                <span className="text-xs font-normal text-gray-500 ml-2">
                  ({availableCount} available)
                </span>
              )}
            </label>
            <select
              id="time"
              required
              disabled={!formData.date || loadingSlots}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingSlots ? 'Loading slots...' : formData.date ? 'Select a time' : 'Select date first'}
              </option>
              {availableSlots.map((slot) => (
                <option 
                  key={slot.time} 
                  value={slot.time}
                  disabled={!slot.available}
                  className={slot.available ? 'text-gray-900' : 'text-gray-400'}
                >
                  {slot.time} {!slot.available && '(Unavailable)'}
                </option>
              ))}
            </select>
            {formData.date && availableCount === 0 && !loadingSlots && (
              <p className="text-xs text-red-600 mt-1">No available slots for this date</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
            Purpose *
          </label>
          <textarea
            id="purpose"
            required
            rows={4}
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
            placeholder="Describe the reason for your appointment..."
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
            placeholder="Any additional information..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !formData.date || !formData.time || !formData.purpose}
            className="px-6 py-2.5 bg-gray-900 text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
