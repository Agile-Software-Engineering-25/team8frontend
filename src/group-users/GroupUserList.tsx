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

interface User {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
}

const getAllUsersByGroup = async (groupId: string): Promise<User[]> => {
  console.log('Real-API call → getAllUsersByGroup', groupId);

  const url = `http://localhost:8080/api/ase-08/groups/${groupId}/users?first=0&max=999999`;

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
    setUsers((prev) => [...prev, newUser]);
    setShowAddDialog(false);
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
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.enabled ? 'Aktiv' : 'Inaktiv'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showAddDialog && (
        <AddUserToGroupDialog
          onClose={() => setShowAddDialog(false)}
          onAdd={handleUserAdded}
        />
      )}
    </div>
  );
};