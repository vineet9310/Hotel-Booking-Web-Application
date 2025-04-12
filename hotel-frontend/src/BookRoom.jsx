import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function BookRoom({ roomId, onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guestName: '',
    guestEmail: '',
    guestPhone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Enhanced validation
    if (!formData.checkIn || !formData.checkOut || !formData.guestName || !formData.guestEmail || !formData.guestPhone) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate dates
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError('Check-in date cannot be in the past');
      setLoading(false);
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.guestEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate phone number (basic format)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.guestPhone)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(`${API_URL}/bookings/create`, {
        ...formData,
        roomId
      }, {
        headers: { Authorization: token }
      });

      alert('Room booked successfully!');
      onClose();
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal" style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '500px',
      zIndex: 1000
    }}>
      <h2 style={{ marginBottom: '15px', color: '#333', fontSize: '1.2rem' }}>Book Room</h2>
      
      {error && (
        <div style={{ color: '#f44336', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label htmlFor="checkIn" style={{ fontSize: '1rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '5px' }}>Check-in Date</label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            style={{ width: '100%', padding: '8px', marginTop: '3px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="checkOut" style={{ fontSize: '1rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '5px' }}>Check-out Date</label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            min={formData.checkIn || new Date().toISOString().split('T')[0]}
            style={{ width: '100%', padding: '8px', marginTop: '3px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="guestName" style={{ fontSize: '1rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '5px' }}>Name</label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '3px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="guestEmail" style={{ fontSize: '1rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            id="guestEmail"
            name="guestEmail"
            value={formData.guestEmail}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '3px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label htmlFor="guestPhone" style={{ fontSize: '1rem', fontWeight: '600', color: '#333', display: 'block', marginBottom: '5px' }}>Phone</label>
          <input
            type="tel"
            id="guestPhone"
            name="guestPhone"
            value={formData.guestPhone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '3px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookRoom;