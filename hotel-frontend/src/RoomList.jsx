import { useEffect, useState } from 'react';
import axios from 'axios';
import BookRoom from './BookRoom';

const API_URL = 'http://localhost:5000';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/rooms`);
        setRooms(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load rooms. Please try again.');
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '1.5rem' }}>Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
          {rooms.map((room) => (
            <div
              key={room._id}
              style={{
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '4px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>{room.type}</div>
              <div style={{ color: '#666', marginBottom: '5px' }}>₹{room.price}</div>
              <div style={{ 
                color: room.available ? '#4CAF50' : '#f44336',
                fontSize: '0.9rem',
                marginBottom: '10px'
              }}>
                {room.available ? 'Available' : 'Not Available'}
              </div>
              {room.available && (
                <button
                  onClick={() => setSelectedRoom(room)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedRoom && (
        <BookRoom
          roomId={selectedRoom._id}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}

export default RoomList;