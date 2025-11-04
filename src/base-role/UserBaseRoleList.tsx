import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './UserBaseRoleList.css';

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
}

// --- ICON AUS ROLE EDIT ---
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

// --- MOCK / API FUNCTION ---
const getAllUsersByStandardRole = async (
  baseRoleId: string
): Promise<UserSummary[]> => {
  // const response = await fetch(`/api/base-role/${baseRoleId}/users`);
  // const data = await response.json();
  // return data;

  console.log('Mock-API call → getAllUsersByStandardRole', baseRoleId);

  const mockData: Record<string, UserSummary[]> = {
    '1': [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Sys',
        lastName: 'Admin',
        enabled: true,
      },
      {
        id: '2',
        username: 'root',
        email: 'root@example.com',
        firstName: 'Root',
        lastName: 'User',
        enabled: false,
      },
    ],
    '2': [
      {
        id: '3',
        username: 'maria.pr',
        email: 'maria@example.com',
        firstName: 'Maria',
        lastName: 'PR',
        enabled: true,
      },
    ],
    '3': [
      {
        id: '4',
        username: 'student1',
        email: 'student1@example.com',
        firstName: 'Max',
        lastName: 'Mustermann',
        enabled: true,
      },
      {
        id: '5',
        username: 'student2',
        email: 'student2@example.com',
        firstName: 'Anna',
        lastName: 'Schmidt',
        enabled: true,
      },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData[baseRoleId] || []), 300);
  });
};

export const UserBaseRoleList: React.FC = () => {
  const { baseRoleId } = useParams<{ baseRoleId: string }>();
  const location = useLocation();
  const standardRole =
    (location.state as { standardRole?: string })?.standardRole ?? 'Unbekannt';

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllUsersByStandardRole(baseRoleId ?? '');
        setUsers(data);
      } catch {
        setError('Fehler beim Laden der Benutzer.');
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [baseRoleId]);

  return (
    <div className="userlist-container">
      <header className="userlist-header">
        <div className="header-title-group">
          <Link to="/" className="back-link">
            <ArrowLeftIcon />
          </Link>
          <h1 className="userlist-title">
            Benutzer der Standardrolle "{standardRole}"
          </h1>
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
                <th>Vorname</th>
                <th>Nachname</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

// In case enabled and id is of interest
/*            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>E-Mail</th>
                <th>Vorname</th>
                <th>Nachname</th>
                <th>Aktiv</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.enabled ? 'ja' : 'nein'}</td>
                </tr>
                */
