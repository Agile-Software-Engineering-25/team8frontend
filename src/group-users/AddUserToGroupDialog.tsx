import React, { useEffect, useState } from 'react';
import './AddUserToGroupDialog.css';

// --- ICON ---
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- MOCK API ---
// GET /api/users
const getAllAvailableUsers = async () => {
  console.log('Mock-API call → getAllAvailableUsers');

  const mockAllUsers = [
    { id: '10', username: 'anna.m', email: 'anna.m@example.com' },
    { id: '11', username: 'marco.r', email: 'marco.r@example.com' },
    { id: '12', username: 'julia.b', email: 'julia.b@example.com' },
    { id: '13', username: 'max.s', email: 'max.s@example.com' },
    { id: '14', username: 'frank.t', email: 'frank.t@example.com' },
  ];

  return new Promise<typeof mockAllUsers>((resolve) =>
    setTimeout(() => resolve(mockAllUsers), 300)
  );
};

interface Props {
  onClose: () => void;
  onAdd: (user: any) => void;
}

export const AddUserToGroupDialog: React.FC<Props> = ({ onClose, onAdd }) => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAllAvailableUsers();
      setAllUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Benutzer hinzufügen</h2>
          <button className="dialog-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <input
          className="search-list-input"
          placeholder="Benutzer suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Benutzer werden geladen...</p>
        ) : (
          <div className="user-list-scroll">
            {filtered.length === 0 && <p>Keine Benutzer gefunden.</p>}
            {filtered.map((u) => (
              <div
                key={u.id}
                className="role-item"
                onClick={() => onAdd(u)}
                style={{ cursor: 'pointer' }}
              >
                <strong>{u.username}</strong> – {u.email}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
