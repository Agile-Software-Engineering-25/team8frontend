import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import './EditGroup.css';

// --- INTERFACES ---
interface Role {
  id: string;
  name: string;
}

// --- MOCK API FUNCTIONS ---

const fetchAllRoles = async (): Promise<Role[]> => {
  console.log('Lade alle verfügbaren Rollen...');
  const allRoles: Role[] = [
    { id: 'role-1', name: 'Benutzer erstellen' },
    { id: 'role-2', name: 'Benutzer löschen' },
    { id: 'role-3', name: 'Artikel veröffentlichen' },
    { id: 'role-4', name: 'Artikel bearbeiten' },
    { id: 'role-5', name: 'Kommentare moderieren' },
    { id: 'role-6', name: 'Dashboard ansehen' },
    { id: 'role-7', name: 'Einstellungen ändern' },
    { id: 'role-8', name: 'Berichte exportieren' },
  ];
  return new Promise((resolve) =>
    setTimeout(() => resolve(allRoles), 300)
  );
};

const fetchGroupDetails = async (groupId: string) => {
  console.log(`Lade Details für Gruppe ${groupId}...`);
  const mockGroup = {
    id: parseInt(groupId),
    name: `Informatik Gruppe F-${groupId}`,
    assignedRoleIds: ['role-3', 'role-4', 'role-6'],
  };
  return new Promise<{
    id: number;
    name: string;
    assignedRoleIds: string[];
  }>((resolve) => setTimeout(() => resolve(mockGroup), 500));
};

const addRoleToGroup = async (
  groupId: string,
  roleId: string
): Promise<void> => {
  console.log(
    `API CALL: Füge Rolle '${roleId}' zu Gruppe '${groupId}' hinzu.`
  );
  return new Promise((resolve) => setTimeout(resolve, 400));
};

const removeRoleFromGroup = async (
  groupId: string,
  roleId: string
): Promise<void> => {
  console.log(
    `API CALL: Entferne Rolle '${roleId}' von Gruppe '${groupId}'.`
  );
  return new Promise((resolve) => setTimeout(resolve, 400));
};

const fetchStandardGroups = async (): Promise<string[]> => {
  console.log('Lade verfügbare StandardGruppen...');
  const Groups = ['Administrator', 'PR', 'Student', 'Dozent', 'Redakteur'];
  return new Promise((resolve) => setTimeout(() => resolve(Groups), 200));
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
export const EditGroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const isNewGroup = groupId === 'new';

  const [GroupName, setGroupName] = useState('');
  const [assigned, setAssigned] = useState<Role[]>([]);
  const [available, setAvailable] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedSearch, setAssignedSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');
  const [standardGroups, setStandardGroups] = useState<string[]>([]);
  const [selectedStandardGroup, setSelectedStandardGroup] = useState('');

  useEffect(() => {
    const loadData = async () => {
      console.log("loadData() called with groupId =", groupId, "isNewGroup =", isNewGroup);
      setLoading(true);
      if (isNewGroup) {
        const [allRoles, standardGroupsData] = await Promise.all([
          fetchAllRoles(),
          fetchStandardGroups(),
        ]);
        setAvailable(allRoles);
        setAssigned([]);
        setGroupName('');
        setStandardGroups(standardGroupsData);
        if (standardGroupsData.length > 0) {
          setSelectedStandardGroup(standardGroupsData[0]);
        }
      } else if (groupId) {
        // Modus: Bestehende Gruppe bearbeiten
        const [allRoles, GroupDetails] = await Promise.all([
          fetchAllRoles(),
          fetchGroupDetails(groupId),
        ]);
        setGroupName(GroupDetails.name);
        const assignedRoles = allRoles.filter((p) =>
          GroupDetails.assignedRoleIds.includes(p.id)
        );
        const availableRoles = allRoles.filter(
          (p) => !GroupDetails.assignedRoleIds.includes(p.id)
        );
        setAssigned(assignedRoles);
        setAvailable(availableRoles);
      }
      setLoading(false);
    };
    loadData();
  }, [groupId, isNewGroup]);

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

    if (isMovingBetweenLists && !isNewGroup && groupId) {
      try {
        if (destListId === 'assigned') {
          await addRoleToGroup(groupId, draggableId);
        } else {
          await removeRoleFromGroup(groupId, draggableId);
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Rolle:', error);
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
          <h1>{isNewGroup ? 'Neue Gruppe erstellen' : 'Gruppe bearbeiten'}</h1>
        </div>

        {/* --- Wrapper für die Aktionen rechts --- */}
        <div className="header-actions">
          {isNewGroup && (
            <div className="standard-group-selector">
              <label htmlFor="standard-group">StandardGruppe</label>
              <select
                id="standard-group"
                value={selectedStandardGroup}
                onChange={(e) => setSelectedStandardGroup(e.target.value)}
              >
                {standardGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          )}
          <input
            type="text"
            value={GroupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={isNewGroup ? 'Name der neuen Gruppe' : ''}
            className="group-name-input"
          />
          <button className="btn btn-primary">
            {isNewGroup ? 'Gruppe erstellen' : 'Änderungen speichern'}
          </button>
        </div>
        {/* --- Ende des Wrappers --- */}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="role-columns">
          <div className="role-column">
            <h2>Zugewiesene Rollen ({filteredAssigned.length})</h2>
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
                  className="role-list"
                >
                  {filteredAssigned.map((role, index) => (
                    <Draggable
                      key={role.id}
                      draggableId={role.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="role-item"
                        >
                          {role.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="role-column">
            <h2>Verfügbare Rollen ({filteredAvailable.length})</h2>
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
                  className="role-list"
                >
                  {filteredAvailable.map((role, index) => (
                    <Draggable
                      key={role.id}
                      draggableId={role.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="role-item"
                        >
                          {role.name}
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
