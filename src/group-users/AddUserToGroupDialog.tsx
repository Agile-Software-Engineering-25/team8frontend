import React, { useEffect, useState, useMemo } from 'react';
import './AddUserToGroupDialog.css';

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

interface User {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
}

const getAllAvailableUsers = async (): Promise<User[]> => {
  console.log('Real-API call → getAllAvailableUsers');
  const url = 'http://localhost:8080/api/ase-08/users?first=0&max=999999';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: '*/*',
    },
  });

  if (!response.ok) {
    throw new Error('Fehler beim Laden der verfügbaren Benutzer.');
  }
  return response.json();
};

const addUserToGroup = async (groupId: string, userId: string) => {
  console.log(
    `Real-API call → addUserToGroup (User: ${userId}, Group: ${groupId})`
  );
  const url = `http://localhost:8080/api/ase-08/groups/${groupId}/users`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
    },
    body: JSON.stringify({
      userIds: [userId],
    }),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Hinzufügen des Benutzers zur Gruppe.');
  }
  return true;
};

interface Props {
  groupId: string;
  existingUsers: User[];
  onClose: () => void;
  onAdd: (user: User) => void;
}

export const AddUserToGroupDialog: React.FC<Props> = ({
  groupId,
  existingUsers,
  onClose,
  onAdd,
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingList(true);
        const data = await getAllAvailableUsers();
        setAllUsers(data);
      } catch (err) {
        setError('Benutzerliste konnte nicht geladen werden.');
        console.log(err);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, []);

  const handleAddClick = async (user: User) => {
    if (isAdding) return;

    setIsAdding(true);
    setError(null);

    try {
      await addUserToGroup(groupId, user.id);
      onAdd(user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsAdding(false);
    }
  };

  const availableUsers = useMemo(() => {
    const existingUserIds = new Set(existingUsers.map((u) => u.id));
    return allUsers.filter((u) => !existingUserIds.has(u.id));
  }, [allUsers, existingUsers]);

  const filtered = availableUsers.filter((u) => {
    const searchLower = search.toLowerCase();

    const usernameMatch = (u.username || '')
      .toLowerCase()
      .includes(searchLower);
    const emailMatch = (u.email || '').toLowerCase().includes(searchLower);

    return usernameMatch || emailMatch;
  });

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Benutzer hinzufügen</h2>
          <button
            className="dialog-close"
            onClick={onClose}
            disabled={isAdding}
          >
            <CloseIcon />
          </button>
        </div>

        {error && <p className="dialog-error">{error}</p>}

        <input
          className="search-list-input"
          placeholder="Benutzer suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isAdding}
        />

        {loadingList ? (
          <p>Benutzer werden geladen...</p>
        ) : (
          <div className="user-list-scroll">
            {filtered.length === 0 && <p>Keine Benutzer gefunden.</p>}
            {filtered.map((u) => (
              <div
                key={u.id}
                className="role-item"
                onClick={() => handleAddClick(u)}
                style={{
                  cursor: isAdding ? 'wait' : 'pointer',
                  opacity: isAdding ? 0.7 : 1,
                }}
              >
                <strong>{u.username}</strong> – {u.email}
              </div>
            ))}
          </div>
        )}

        {isAdding && <p>Benutzer wird hinzugefügt...</p>}
      </div>
    </div>
  );
};
