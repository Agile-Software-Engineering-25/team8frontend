// src/Startseite.tsx

import React, { useState, useMemo } from 'react';
import { RoleCard } from '../components/RoleCard';
import type { UserRole } from '../components/RoleCard';
import './Startseite.css'; 

// ANPASSUNG: Weitere Rolle hinzugefügt, um die Filterung zu demonstrieren
const initialRoles: UserRole[] = [
  { id: 1, name: 'Globaler Administrator', standardRole: 'Administrator', userCount: 5 },
  { id: 2, name: 'Marketing Team', standardRole: '', userCount: 12 },
  { id: 3, name: 'Informatik Gruppe F-3', standardRole: 'Student', userCount: 25 },
  { id: 4, name: 'Alle Dozenten', standardRole: 'Dozent', userCount: 50 },
  { id: 5, name: 'Werkstudenten IT', standardRole: '', userCount: 8 },
  { id: 6, name: 'Informatik Gruppe F-2', standardRole: 'Student', userCount: 31 },
];

export const Startseite: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Der 'filter' state speichert jetzt direkt den Namen der Standardrolle
  const [filter, setFilter] = useState<string>('all'); 

  // ANPASSUNG: Einzigartige Standardrollen dynamisch aus den Daten ermitteln
  const standardRoleTypes = useMemo(() => {
    // Erstellt ein Set, um doppelte Einträge automatisch zu entfernen
    const uniqueRoles = new Set(
      initialRoles
        .map(role => role.standardRole) // Nur die 'standardRole' Eigenschaft extrahieren
        .filter(roleName => roleName !== '') // Leere Einträge (eigene Rollen) herausfiltern
    );
    // Wandelt das Set zurück in ein Array um, damit wir darüber mappen können
    return Array.from(uniqueRoles); 
  }, []); // Dieses Array muss nur einmal beim ersten Rendern erstellt werden

  const filteredRoles = useMemo(() => {
    return initialRoles.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // ANPASSUNG: Die Filter-Logik wurde erweitert
      const matchesFilter = 
        filter === 'all' || // "Alle" anzeigen
        (filter === 'custom' && role.standardRole === '') || // Nur "Eigene Rollen" anzeigen
        (role.standardRole === filter); // Nur Rollen anzeigen, deren Standardrolle dem Filter entspricht
        
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);

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
          {/* Statische Optionen */}
          <option value="all">Alle Rollen</option>
          <option value="custom">Eigene Rollen</option>
          
          {/* ANPASSUNG: Dynamische Optionen basierend auf den Daten */}
          {standardRoleTypes.map(roleType => (
            <option key={roleType} value={roleType}>
              {roleType}
            </option>
          ))}
        </select>
        <button className="btn btn-primary">Benutzerrolle erstellen</button>
        <button className="btn btn-secondary">Benutzer Rollen hinzufügen</button>
      </header>

      <main className="roles-list">
        {filteredRoles.length > 0 ? (
          filteredRoles.map(role => (
            <RoleCard key={role.id} role={role} />
          ))
        ) : (
          <p>Keine Rollen gefunden.</p>
        )}
      </main>
    </div>
  );
};