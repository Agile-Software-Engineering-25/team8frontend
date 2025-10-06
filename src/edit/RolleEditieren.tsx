// src/EditRolePage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import './RolleEditieren.css';

// --- Mock-Daten (in einer echten App käme das vom Backend) ---

// Eine Liste aller existierenden Berechtigungen
const ALL_PERMISSIONS = [
  { id: 'perm-1', name: 'Benutzer erstellen' },
  { id: 'perm-2', name: 'Benutzer löschen' },
  { id: 'perm-3', name: 'Artikel veröffentlichen' },
  { id: 'perm-4', name: 'Artikel bearbeiten' },
  { id: 'perm-5', name: 'Kommentare moderieren' },
  { id: 'perm-6', name: 'Dashboard ansehen' },
  { id: 'perm-7', name: 'Einstellungen ändern' },
  { id: 'perm-8', name: 'Berichte exportieren' },
];

// Mock-Funktion, um eine Rolle und ihre Berechtigungen zu laden
const fetchRoleDetails = async (roleId: string) => {
  console.log(`Lade Details für Rolle ${roleId}...`);
  // Simuliert das Finden der Rolle
  const mockRole = {
    id: parseInt(roleId),
    name: `Informatik Gruppe F-${roleId}`,
    // Simuliert bereits zugewiesene Berechtigungen
    assignedPermissionIds: ['perm-3', 'perm-4', 'perm-6'],
  };
  return new Promise<{ id: number; name: string; assignedPermissionIds: string[] }>(resolve =>
    setTimeout(() => resolve(mockRole), 500)
  );
};
// --- Ende Mock-Daten ---

interface Permission {
  id: string;
  name: string;
}

export const EditRolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const [roleName, setRoleName] = useState('');
  const [assigned, setAssigned] = useState<Permission[]>([]);
  const [available, setAvailable] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const [assignedSearch, setAssignedSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');

  // Daten für die Rolle laden
  useEffect(() => {
    if (!roleId) return;
    const loadData = async () => {
      setLoading(true);
      const details = await fetchRoleDetails(roleId);
      setRoleName(details.name);

      const assignedPerms = ALL_PERMISSIONS.filter(p => details.assignedPermissionIds.includes(p.id));
      const availablePerms = ALL_PERMISSIONS.filter(p => !details.assignedPermissionIds.includes(p.id));

      setAssigned(assignedPerms);
      setAvailable(availablePerms);
      setLoading(false);
    };
    loadData();
  }, [roleId]);

  // Drag-and-Drop Logik
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // Fallen gelassen außerhalb einer Liste

    const sourceList = source.droppableId === 'assigned' ? [...assigned] : [...available];
    const destList = destination.droppableId === 'assigned' ? [...assigned] : [...available];
    const [movedItem] = sourceList.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Bewegung innerhalb der gleichen Liste
      sourceList.splice(destination.index, 0, movedItem);
      if (source.droppableId === 'assigned') setAssigned(sourceList);
      else setAvailable(sourceList);
    } else {
      // Bewegung zur anderen Liste
      destList.splice(destination.index, 0, movedItem);
      setAssigned(destination.droppableId === 'assigned' ? destList : sourceList);
      setAvailable(destination.droppableId === 'available' ? destList : sourceList);
    }
  };
  
  // Gefilterte Listen für die Suche
  const filteredAssigned = useMemo(() => assigned.filter(p => p.name.toLowerCase().includes(assignedSearch.toLowerCase())), [assigned, assignedSearch]);
  const filteredAvailable = useMemo(() => available.filter(p => p.name.toLowerCase().includes(availableSearch.toLowerCase())), [available, availableSearch]);

  if (loading) return <div>Lade Rollendetails...</div>;

  return (
    <div className="edit-page-container">
      <div className="edit-page-header">
        <Link to="/" className="back-link">← Zurück zur Übersicht</Link>
        <h1>Rolle bearbeiten</h1>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="role-name-input"
        />
        {/* Hier käme ein Speicher-Button hin */}
        <button className="btn btn-primary">Änderungen speichern</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="permission-columns">
          {/* Linke Spalte: Zugewiesene Berechtigungen */}
          <div className="permission-column">
            <h2>Zugewiesene Berechtigungen ({filteredAssigned.length})</h2>
            <input type="text" placeholder="Suchen..." className="search-list-input" value={assignedSearch} onChange={e => setAssignedSearch(e.target.value)} />
            <Droppable droppableId="assigned">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="permission-list">
                  {filteredAssigned.map((perm, index) => (
                    <Draggable key={perm.id} draggableId={perm.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="permission-item">
                          {perm.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Rechte Spalte: Verfügbare Berechtigungen */}
          <div className="permission-column">
            <h2>Verfügbare Berechtigungen ({filteredAvailable.length})</h2>
            <input type="text" placeholder="Suchen..." className="search-list-input" value={availableSearch} onChange={e => setAvailableSearch(e.target.value)} />
            <Droppable droppableId="available">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="permission-list">
                  {filteredAvailable.map((perm, index) => (
                    <Draggable key={perm.id} draggableId={perm.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="permission-item">
                          {perm.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};