import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import RoomList from "./RoomList";
import AddRoom from "./AddRoom";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <div>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/rooms">Rooms</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/">Register</Link> | <Link to="/add-room">Add Room</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Register />} /> {/* Default route */}
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-room" element={<AddRoom token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
