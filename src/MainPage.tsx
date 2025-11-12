import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupCard } from '../components/GroupCard';
import type { UserGroup } from '../components/GroupCard';

import './MainPage.css';

const fetchGroupsFromBackend = async (): Promise<UserGroup[]> => {
  console.log('Rufe Gruppen vom Backend ab...');
  const url = `${window.API_BASE_URL}/groups`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }

    const data: UserGroup[] = await response.json();
    const processedData: UserGroup[] = data.map(group => {
      return {
        ...group,       
        parentName: group.parentName ?? "NULL"
      };
    });

    return processedData;

  } catch (error) {
    console.error('Fehler beim Abrufen der Gruppen:', error);
    return [];
  }
};

export const Startseite: React.FC = () => {
  const [Groups, setGroups] = useState<UserGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  // HIER: Hook initialisieren
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedGroups = await fetchGroupsFromBackend();
        setGroups(fetchedGroups);
      } catch (err) {
        setError('Fehler beim Laden der Gruppen.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGroups();
  }, []);

  const parentNameTypes = useMemo(() => {
    const uniqueGroups = new Set(
      Groups.map((Group) => Group.parentName).filter(
        (GroupName) => GroupName !== ''
      )
    );
    return Array.from(uniqueGroups);
  }, [Groups]);

  const filteredGroups = useMemo(() => {
    return Groups.filter((Group) => {
      const matchesSearch = Group.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        Group.parentName === '' ||
        Group.parentName === filter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter, Groups]);

  // HIER: Handler-Funktion für den Klick
  const handleCreateNewGroup = () => {
    navigate('/group/new');
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
          <option value="all">Alle Gruppen</option>
          {parentNameTypes.map((GroupType) => (
            <option key={GroupType} value={GroupType}>
              {GroupType}
            </option>
          ))}
        </select>

        <button onClick={handleCreateNewGroup} className="btn btn-primary">
          Benutzergruppe erstellen
        </button>
      </header>

      <main className="groups-list">
        {isLoading && <p>Gruppen werden geladen...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading &&
          !error &&
          (filteredGroups.length > 0 ? (
            filteredGroups.map((Group) => (
              <GroupCard key={Group.id} Group={Group} />
            ))
          ) : (
            <p>Keine Gruppen gefunden.</p>
          ))}
      </main>
    </div>
  );
};
