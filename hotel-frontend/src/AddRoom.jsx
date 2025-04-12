import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function AddRoom({ token }) {
  const [formData, setFormData] = useState({
    type: '',
    price: '',
    available: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.type || !formData.price || !formData.available) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post(`${API_URL}/rooms/add`, formData, {
        headers: { Authorization: token }
      });
      setSuccess('Room added successfully');
      setFormData({ type: '', price: '', available: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room');
    }
  };

  return (
    <div className="add-room-container">
      <h2>Add Room (Admin Only)</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleAdd}>
        <div className="form-group">
          <input
            name="type"
            value={formData.type}
            placeholder="Room Type"
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <input
            name="price"
            type="number"
            value={formData.price}
            placeholder="Price"
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group">
          <input
            name="available"
            type="number"
            value={formData.available}
            placeholder="Available"
            onChange={handleChange}
            min="0"
          />
        </div>

        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoom;