import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate hinzugefügt
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import './EditGroup.css';

interface Role {
  id: string;
  name: string;
  userCount?: number;
}

interface Group {
  id: string;
  name: string;
}

interface GroupDetails {
  id: string;
  name: string;
  permissions: Role[];
  attributes: { [key: string]: string };
}

const fetchAllRoles = async (): Promise<Role[]> => {
  console.log('Lade alle verfügbaren Rollen...');
  const response = await fetch(`${window.API_BASE_URL}/roles`, {
    method: 'GET',
    headers: { accept: '*/*' },
  });
  if (!response.ok) throw new Error('Rollen konnten nicht geladen werden.');
  return response.json();
};

const fetchGroupDetails = async (groupId: string): Promise<GroupDetails> => {
  console.log(`Lade Details für Gruppe ${groupId}...`);
  const response = await fetch(`${window.API_BASE_URL}/groups/${groupId}`, {
    method: 'GET',
    headers: { Accept: '*/*' },
  });
  if (!response.ok) throw new Error('Gruppendetails konnten nicht geladen werden.');
  return response.json();
};

const addRoleToGroup = async (groupId: string, roleId: string): Promise<void> => {
  console.log(`API CALL: Füge Rolle '${roleId}' zu Gruppe '${groupId}' hinzu.`);
  const response = await fetch(
    `${window.API_BASE_URL}/groups/${encodeURIComponent(groupId)}/permissions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify({ permissionIds: [roleId] }),
    }
  );
  if (!response.ok) throw new Error('Rolle konnte nicht hinzugefügt werden.');
};

const removeRoleFromGroup = async (groupId: string, roleId: string): Promise<void> => {
  console.log(`API CALL: Entferne Rolle '${roleId}' von Gruppe '${groupId}'.`);
  const response = await fetch(
    `${window.API_BASE_URL}/groups/${encodeURIComponent(groupId)}/permissions`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify({ permissionIds: [roleId] }),
    }
  );
  if (!response.ok) throw new Error('Rolle konnte nicht entfernt werden.');
};

const fetchAllGroups = async (): Promise<Group[]> => {
  console.log('Lade verfügbare StandardGruppen (alle Gruppen)...');
  const response = await fetch(`${window.API_BASE_URL}/groups`, {
    method: 'GET',
    headers: { accept: '*/*' },
  });
  if (!response.ok) throw new Error('Gruppenliste konnte nicht geladen werden.');
  return response.json();
};

const updateGroupName = async (
  groupId: string,
  newName: string,
  currentAttributes: { [key: string]: string }
): Promise<void> => {
  console.log(`API CALL: Ändere Namen von Gruppe '${groupId}' zu '${newName}'.`);
  const url = `${window.API_BASE_URL}/groups/${encodeURIComponent(groupId)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify({ name: newName, attributes: currentAttributes }),
  });
  if (!response.ok) throw new Error('Gruppenname konnte nicht geändert werden.');
};

const searchGroupByName = async (name: string): Promise<GroupDetails> => {
  console.log(`API CALL: Suche Gruppe mit Namen '${name}' um ID zu erhalten...`);
  const response = await fetch(`${window.API_BASE_URL}/groups/search?name=${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: { accept: '*/*' },
  });
  
  if (!response.ok) {
    throw new Error('Gruppe konnte nicht gefunden werden.');
  }
  return response.json();
};

const createChildGroup = async (
  parentGroupId: string,
  name: string,
  attributes: { [key: string]: string }
): Promise<GroupDetails> => {
  console.log(`API CALL: Erstelle Child-Group unter '${parentGroupId}'.`);
  const response = await fetch(
    `${window.API_BASE_URL}/groups/${encodeURIComponent(parentGroupId)}/children`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify({
        name: name,
        attributes: attributes
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Gruppe konnte nicht erstellt werden.');
  }
  return response.json();
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

export const EditGroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate(); // Hook für Navigation
  const isNewGroup = groupId === 'new';

  const [groupName, setGroupName] = useState('');
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [assigned, setAssigned] = useState<Role[]>([]);
  const [available, setAvailable] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [assignedSearch, setAssignedSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');

  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (isNewGroup) {
          const allGroupsData = await fetchAllGroups();
          setAllGroups(allGroupsData);
          setAvailable([]);
          setAssigned([]);
          setGroupName('');
          setAttributes({});

          if (allGroupsData.length > 0) {
            setSelectedGroupId(allGroupsData[0].id);
          }
        } else if (groupId) {
          const [allRoles, groupDetails] = await Promise.all([
            fetchAllRoles(),
            fetchGroupDetails(groupId),
          ]);

          setGroupName(groupDetails.name || ''); // FIX: Fallback für Name
          setAttributes(groupDetails.attributes || {}); // FIX: Fallback für Attributes

          const assignedRoles = groupDetails.permissions || []; 
          
          const assignedRoleIds = new Set(assignedRoles.map((p) => p.id));

          const availableRoles = allRoles.filter(
            (p) => !assignedRoleIds.has(p.id)
          );

          setAssigned(assignedRoles);
          setAvailable(availableRoles);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isNewGroup) {
        console.log('Erstelle neue Gruppe...');
        
        const selectedGroupObj = allGroups.find(g => g.id === selectedGroupId);
        if (!selectedGroupObj) {
          throw new Error("Keine Elterngruppe ausgewählt.");
        }

        const parentGroupDetails = await searchGroupByName(selectedGroupObj.name);
        const parentIdFromSearch = parentGroupDetails.id;
        const newGroup = await createChildGroup(parentIdFromSearch, groupName, attributes);
        
        console.log('Gruppe erfolgreich erstellt:', newGroup);
        navigate(`/group/${newGroup.id}`);
        
      } else if (groupId) {
        await updateGroupName(groupId, groupName, attributes);
        console.log('Name erfolgreich geändert!');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern: ' + error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Lade Details...</div>;

  const filteredAssigned = assigned.filter((p) =>
    (p.name || '').toLowerCase().includes(assignedSearch.toLowerCase())
  );
  const filteredAvailable = available.filter((p) =>
    (p.name || '').toLowerCase().includes(availableSearch.toLowerCase())
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

        <div className="header-actions">
          {isNewGroup && (
            <div className="standard-group-selector">
              <label htmlFor="standard-group">Standard Gruppe</label>
              <select
                id="standard-group"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                {allGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={isNewGroup ? 'Name der neuen Gruppe' : ''}
            className="group-name-input"
            disabled={isSaving}
          />
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving || (isNewGroup && !groupName)}
          >
            {isSaving
              ? 'Wird gespeichert...'
              : isNewGroup
                ? 'Gruppe erstellen'
                : 'Name Ändern'}
          </button>
        </div>
      </div>

      {/* Conditional Rendering: DragDropContext nur anzeigen, wenn KEINE neue Gruppe erstellt wird */}
      {isNewGroup ? (
        <div className="new-group-placeholder">
          <div className="placeholder-content">
            <h3>Rollen zuweisen</h3>
            <p>Bitte erstellen Sie zuerst die Gruppe, um Rollen per Drag & Drop zuzuweisen.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
               Wählen Sie oben eine Standard Gruppe, geben Sie einen Namen ein und klicken Sie auf "Gruppe erstellen".
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};