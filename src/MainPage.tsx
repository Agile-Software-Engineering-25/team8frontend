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
        parentName: group.parentName ?? "Keine Übergruppe"
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

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const processedGroups = useMemo(() => {
    const filtered = Groups.filter((Group) => {
      const matchesSearch = Group.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return filtered;

  }, [searchTerm, sortOrder, Groups]);

  const handleCreateNewGroup = () => {
    navigate('/group/new');
  };
  const handleToggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
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
        <button onClick={handleToggleSortOrder} className="btn">
          Sortieren: {sortOrder === 'asc' ? 'Aufsteigend (A-Z)' : 'Absteigend (Z-A)'}
        </button>

        <button onClick={handleCreateNewGroup} className="btn btn-primary">
          Benutzergruppe erstellen
        </button>
      </header>

      <main className="groups-list">
        {isLoading && <p>Gruppen werden geladen...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isLoading &&
          !error &&
          (processedGroups.length > 0 ? (
            processedGroups.map((Group) => (
              <GroupCard key={Group.id} Group={Group} />
            ))
          ) : (
            <p>Keine Gruppen gefunden.</p>
          ))}
      </main>
    </div>
  );
};