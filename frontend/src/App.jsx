import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Fetch users from backend
  useEffect(() => {
    fetch("http://localhost:5001/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  // Add user
  const handleAddUser = async () => {
    if (!username || !email) return alert("Fill all fields");
  
    try {
      const res = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email })
      });
      const data = await res.json();
      console.log("POST response:", data); // <--- check this
      setUsers([...users, data.user]);
      setUsername(""); setEmail("");
    } catch (err) {
      console.error("POST error:", err);
    }
  };
  

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <b>{user.username}</b> - {user.email}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
    </div>
  );
}

export default App;
