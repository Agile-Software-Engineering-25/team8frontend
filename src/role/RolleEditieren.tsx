import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import './RolleEditieren.css';

// --- INTERFACES ---
interface Permission {
  id: string;
  name: string;
}

// --- MOCK API FUNCTIONS ---

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

const addPermissionToRole = async (
  roleId: string,
  permissionId: string
): Promise<void> => {
  console.log(
    `API CALL: Füge Berechtigung '${permissionId}' zu Rolle '${roleId}' hinzu.`
  );
  return new Promise((resolve) => setTimeout(resolve, 400));
};

const removePermissionFromRole = async (
  roleId: string,
  permissionId: string
): Promise<void> => {
  console.log(
    `API CALL: Entferne Berechtigung '${permissionId}' von Rolle '${roleId}'.`
  );
  return new Promise((resolve) => setTimeout(resolve, 400));
};

const fetchStandardRoles = async (): Promise<string[]> => {
  console.log('Lade verfügbare Standardrollen...');
  const roles = ['Administrator', 'PR', 'Student', 'Dozent', 'Redakteur'];
  return new Promise((resolve) => setTimeout(() => resolve(roles), 200));
};

// --- HELPER COMPONENTS ---
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

// --- MAIN COMPONENT ---
export const EditRolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const isNewRole = roleId === 'new';

  const [roleName, setRoleName] = useState('');
  const [assigned, setAssigned] = useState<Permission[]>([]);
  const [available, setAvailable] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedSearch, setAssignedSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');
  const [standardRoles, setStandardRoles] = useState<string[]>([]);
  const [selectedStandardRole, setSelectedStandardRole] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (isNewRole) {
        // Modus: Neue Rolle erstellen
        const [allPermissions, standardRolesData] = await Promise.all([
          fetchAllPermissions(),
          fetchStandardRoles(),
        ]);
        setAvailable(allPermissions);
        setAssigned([]);
        setRoleName('');
        setStandardRoles(standardRolesData);
        if (standardRolesData.length > 0) {
          setSelectedStandardRole(standardRolesData[0]);
        }
      } else if (roleId) {
        // Modus: Bestehende Rolle bearbeiten
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
      }
      setLoading(false);
    };
    loadData();
  }, [roleId, isNewRole]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;
    const isMovingBetweenLists = sourceListId !== destListId;

    const startList =
      source.droppableId === 'assigned' ? [...assigned] : [...available];
    const endList =
      destination.droppableId === 'assigned' ? [...assigned] : [...available];
    const [movedItem] = startList.splice(source.index, 1);

    if (sourceListId === destListId) {
      startList.splice(destination.index, 0, movedItem);
      if (sourceListId === 'assigned') setAssigned(startList);
      else setAvailable(startList);
    } else {
      endList.splice(destination.index, 0, movedItem);
      setAssigned(destination.droppableId === 'assigned' ? endList : startList);
      setAvailable(
        destination.droppableId === 'available' ? endList : startList
      );
    }

    if (isMovingBetweenLists && !isNewRole && roleId) {
      try {
        if (destListId === 'assigned') {
          await addPermissionToRole(roleId, draggableId);
        } else {
          await removePermissionFromRole(roleId, draggableId);
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Berechtigung:', error);
      }
    }
  };

  if (loading) return <div>Lade Details...</div>;

  // Gefilterte Listen für die Anzeige
  const filteredAssigned = assigned.filter((p) =>
    p.name.toLowerCase().includes(assignedSearch.toLowerCase())
  );
  const filteredAvailable = available.filter((p) =>
    p.name.toLowerCase().includes(availableSearch.toLowerCase())
  );

  return (
    <div className="edit-page-container">
      <div className="edit-page-header">
        <div className="header-title-group">
          <Link to="/" className="back-link">
            <ArrowLeftIcon />
          </Link>
          <h1>{isNewRole ? 'Neue Rolle erstellen' : 'Rolle bearbeiten'}</h1>
        </div>

        {/* --- Wrapper für die Aktionen rechts --- */}
        <div className="header-actions">
          {isNewRole && (
            <div className="standard-role-selector">
              <label htmlFor="standard-role">Standardrolle</label>
              <select
                id="standard-role"
                value={selectedStandardRole}
                onChange={(e) => setSelectedStandardRole(e.target.value)}
              >
                {standardRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          )}
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder={isNewRole ? 'Name der neuen Rolle' : ''}
            className="role-name-input"
          />
          <button className="btn btn-primary">
            {isNewRole ? 'Rolle erstellen' : 'Änderungen speichern'}
          </button>
        </div>
        {/* --- Ende des Wrappers --- */}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="permission-columns">
          <div className="permission-column">
            <h2>Zugewiesene Berechtigungen ({filteredAssigned.length})</h2>
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
                  {filteredAssigned.map((perm, index) => (
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="permission-column">
            <h2>Verfügbare Berechtigungen ({filteredAvailable.length})</h2>
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
                  {filteredAvailable.map((perm, index) => (
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
