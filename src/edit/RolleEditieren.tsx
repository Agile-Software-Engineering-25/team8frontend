import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import './RolleEditieren.css';

interface Permission {
  id: string;
  name: string;
}

const fetchAllPermissions = async (): Promise<Permission[]> => {
  console.log('Lade alle verfügbaren Berechtigungen...');
  const allPermissions: Permission[] = [
    { id: 'perm-1', name: 'Benutzer erstellen' },
    { id: 'perm-2', name: 'Benutzer löschen' },
    { id: 'perm-3', name: 'Artikel veröffentlichen' },
    { id: 'perm-4', name: 'Artikel bearbeiten' },
    { id: 'perm-5', name: 'Kommentare moderieren' },
    { id: 'perm-6', name: 'Dashboard ansehen' },
    { id: 'perm-7', name: 'Einstellungen ändern' },
    { id: 'perm-8', name: 'Berichte exportieren' },
  ];
  return new Promise((resolve) =>
    setTimeout(() => resolve(allPermissions), 300)
  );
};

const fetchRoleDetails = async (roleId: string) => {
  console.log(`Lade Details für Rolle ${roleId}...`);
  const mockRole = {
    id: parseInt(roleId),
    name: `Informatik Gruppe F-${roleId}`,
    assignedPermissionIds: ['perm-3', 'perm-4', 'perm-6'],
  };
  return new Promise<{
    id: number;
    name: string;
    assignedPermissionIds: string[];
  }>((resolve) => setTimeout(() => resolve(mockRole), 500));
};

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

export const EditRolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const [roleName, setRoleName] = useState('');
  const [assigned, setAssigned] = useState<Permission[]>([]);
  const [available, setAvailable] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedSearch, setAssignedSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');

  useEffect(() => {
    if (!roleId) return;
    const loadData = async () => {
      setLoading(true);
      const [allPermissions, roleDetails] = await Promise.all([
        fetchAllPermissions(),
        fetchRoleDetails(roleId),
      ]);

      setRoleName(roleDetails.name);
      const assignedPerms = allPermissions.filter((p) =>
        roleDetails.assignedPermissionIds.includes(p.id)
      );
      const availablePerms = allPermissions.filter(
        (p) => !roleDetails.assignedPermissionIds.includes(p.id)
      );
      setAssigned(assignedPerms);
      setAvailable(availablePerms);
      setLoading(false);
    };
    loadData();
  }, [roleId]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList =
      source.droppableId === 'assigned' ? [...assigned] : [...available];
    const destList =
      destination.droppableId === 'assigned' ? [...assigned] : [...available];
    const [movedItem] = sourceList.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceList.splice(destination.index, 0, movedItem);
      if (source.droppableId === 'assigned') setAssigned(sourceList);
      else setAvailable(sourceList);
    } else {
      destList.splice(destination.index, 0, movedItem);
      if (destination.droppableId === 'assigned') {
        setAssigned(destList);
        setAvailable(sourceList);
      } else {
        setAssigned(sourceList);
        setAvailable(destList);
      }
    }
  };

  if (loading) return <div>Lade Rollendetails...</div>;

  return (
    <div className="edit-page-container">
      <div className="edit-page-header">
        <div className="header-title-group">
          <Link to="/" className="back-link">
            <ArrowLeftIcon />
          </Link>
          <h1>Rolle bearbeiten</h1>
        </div>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="role-name-input"
        />
        <button className="btn btn-primary">Änderungen speichern</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="permission-columns">
          <div className="permission-column">
            <h2>
              Zugewiesene Berechtigungen (
              {
                assigned.filter((p) =>
                  p.name.toLowerCase().includes(assignedSearch.toLowerCase())
                ).length
              }
              )
            </h2>
            <input
              type="text"
              placeholder="Suchen..."
              className="search-list-input"
              value={assignedSearch}
              onChange={(e) => setAssignedSearch(e.target.value)}
            />
            <Droppable droppableId="assigned">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="permission-list"
                >
                  {assigned.map((perm, index) => {
                    const shouldShow = perm.name
                      .toLowerCase()
                      .includes(assignedSearch.toLowerCase());
                    return shouldShow ? (
                      <Draggable
                        key={perm.id}
                        draggableId={perm.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="permission-item"
                          >
                            {perm.name}
                          </div>
                        )}
                      </Draggable>
                    ) : null;
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="permission-column">
            <h2>
              Verfügbare Berechtigungen (
              {
                available.filter((p) =>
                  p.name.toLowerCase().includes(availableSearch.toLowerCase())
                ).length
              }
              )
            </h2>
            <input
              type="text"
              placeholder="Suchen..."
              className="search-list-input"
              value={availableSearch}
              onChange={(e) => setAvailableSearch(e.target.value)}
            />
            <Droppable droppableId="available">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="permission-list"
                >
                  {available.map((perm, index) => {
                    const shouldShow = perm.name
                      .toLowerCase()
                      .includes(availableSearch.toLowerCase());
                    return shouldShow ? (
                      <Draggable
                        key={perm.id}
                        draggableId={perm.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="permission-item"
                          >
                            {perm.name}
                          </div>
                        )}
                      </Draggable>
                    ) : null;
                  })}
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
