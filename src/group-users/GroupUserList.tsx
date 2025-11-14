import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './base.css';
import { AddUserToGroupDialog } from './AddUserToGroupDialog';

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

interface User {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
}

const getAllUsersByGroup = async (groupId: string): Promise<User[]> => {
  console.log('Real-API call → getAllUsersByGroup', groupId);

  const url = `${window.API_BASE_URL}/groups/${encodeURIComponent(groupId)}/users?first=0&max=100`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      accept: '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed with status ${response.status}`);
  }

  const data: User[] = await response.json();
  return data;
};

const removeUserFromGroup = async (
  userId: string,
  groupId: string
): Promise<void> => {
  const url = `${window.API_BASE_URL}/users/${encodeURIComponent(userId)}/groups/${encodeURIComponent(groupId)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      accept: '*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed with status ${response.status}`);
  }
};

export const GroupUserList: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const location = useLocation();
  const GroupName =
    (location.state as { GroupName?: string })?.GroupName ?? 'Unbekannt';

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      if (!groupId) {
        setError('Keine Gruppen-ID gefunden.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getAllUsersByGroup(groupId);
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError('Fehler beim Laden der Benutzer.');
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [groupId]);

  const handleUserAdded = (newUser: User) => {
    setUsers((prevUsers) => {
      const alreadyExists = prevUsers.some((user) => user.id === newUser.id);

      if (alreadyExists) {
        console.warn('Benutzer ist bereits in der Liste.');
        return prevUsers;
      }

      return [...prevUsers, newUser];
    });

    setShowAddDialog(false);
  };

  const handleRemoveUser = async (userId: string) => {
    if (!groupId) {
      console.error('Keine Gruppen-ID vorhanden, Entfernen nicht möglich.');
      alert('Fehler: Gruppen-ID fehlt.');
      return;
    }

    try {
      await removeUserFromGroup(userId, groupId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Fehler beim Entfernen des Benutzers:', err);
      alert(
        'Der Benutzer konnte nicht entfernt werden. Bitte versuchen Sie es erneut.'
      );
    }
  };

  return (
    <div className="userlist-container">
      <header className="userlist-header">
        <div className="header-title-group">
          <Link to="/" className="back-link">
            <ArrowLeftIcon />
          </Link>
          <h1 className="userlist-title">Benutzer der Gruppe "{GroupName}"</h1>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddDialog(true)}
          >
            Benutzer hinzufügen
          </button>
        </div>
      </header>

      <section className="userlist-content">
        {isLoading && <p>Benutzer werden geladen...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && !error && users.length === 0 && (
          <p>Keine Benutzer gefunden.</p>
        )}

        {!isLoading && !error && users.length > 0 && (
          <table className="userlist-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>E-Mail</th>
                <th>Status</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.enabled ? 'Aktiv' : 'Inaktiv'}</td>
                  <td>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleRemoveUser(u.id)}
                      title="Benutzer aus Gruppe entfernen"
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showAddDialog && (
        <AddUserToGroupDialog
          groupId={groupId ?? ''}
          existingUsers={users}
          onClose={() => setShowAddDialog(false)}
          onAdd={handleUserAdded}
        />
      )}
    </div>
  );
};
