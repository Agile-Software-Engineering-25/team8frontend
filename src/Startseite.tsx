import React, { useState, useMemo, useEffect } from 'react';
// HIER: 'useNavigate' importieren statt 'Link'
import { useNavigate } from 'react-router-dom';
import { RoleCard } from '../components/RoleCard';
import type { UserRole } from '../components/RoleCard';
import './Startseite.css';

const fetchRolesFromBackend = (): Promise<UserRole[]> => {
  console.log('Rufe Rollen vom Backend ab...');
  const mockRoles: UserRole[] = [
    {
      id: 1,
      name: 'Globaler Administrator',
      standardRole: 'Administrator',
      userCount: 5,
    },
    { id: 2, name: 'Marketing Team', standardRole: 'PR', userCount: 12 },
    {
      id: 3,
      name: 'Informatik Gruppe F-3',
      standardRole: 'Student',
      userCount: 25,
    },
    { id: 4, name: 'Alle Dozenten', standardRole: 'Dozent', userCount: 50 },
    { id: 5, name: 'Werkstudenten IT', standardRole: 'Student', userCount: 8 },
    {
      id: 6,
      name: 'Informatik Gruppe F-2',
      standardRole: 'Student',
      userCount: 31,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRoles);
    }, 100);
  });
};

export const Startseite: React.FC = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  // HIER: Hook initialisieren
  const navigate = useNavigate();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedRoles = await fetchRolesFromBackend();
        setRoles(fetchedRoles);
      } catch (err) {
        setError('Fehler beim Laden der Rollen.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  const standardRoleTypes = useMemo(() => {
    const uniqueRoles = new Set(
      roles
        .map((role) => role.standardRole)
        .filter((roleName) => roleName !== '')
    );
    return Array.from(uniqueRoles);
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = role.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        role.standardRole === '' ||
        role.standardRole === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter, roles]);

  // HIER: Handler-Funktion für den Klick
  const handleCreateNewRole = () => {
    navigate('/role/new');
  };

  return (
    <div className="homepage-container">
      <header className="toolbar">
        <input
          type="text"
          placeholder="Suchen..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Alle Rollen</option>
          {standardRoleTypes.map((roleType) => (
            <option key={roleType} value={roleType}>
              {roleType}
            </option>
          ))}
        </select>
        
        <button onClick={handleCreateNewRole} className="btn btn-primary">
          Benutzerrolle erstellen
        </button>
      </header>

      <main className="roles-list">
        {isLoading && <p>Rollen werden geladen...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading &&
          !error &&
          (filteredRoles.length > 0 ? (
            filteredRoles.map((role) => <RoleCard key={role.id} role={role} />)
          ) : (
            <p>Keine Rollen gefunden.</p>
          ))}
      </main>
    </div>
  );
};