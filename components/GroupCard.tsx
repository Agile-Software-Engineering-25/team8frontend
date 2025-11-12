import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface UserGroup {
  id: number;
  name: string;
  standardGroup: string;
  userCount: number;
}

interface GroupCardProps {
  Group: UserGroup;
}

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const GroupCard: React.FC<GroupCardProps> = ({ Group }) => {
  const isCustomGroup = Group.standardGroup === '';
  const navigate = useNavigate();

  const handleViewGroupUsers = () => {
    navigate(`/group-users/${Group.id}`, {
      state: { GroupName: Group.name },
    });
  };

  return (
    <div className="group-card">
      <Link to={`/group/${Group.id}`} className="edit-icon">
        <EditIcon />
      </Link>

      <div className="card-header">
        <h3 className="group-name">{Group.name}</h3>
      </div>

      <div className="card-content">
        <span className={`group-badge ${isCustomGroup ? 'custom' : 'default'}`}>
          {isCustomGroup ? 'Eigene gruppe' : Group.standardGroup}
        </span>
        <p className="user-count">Anzahl Personen: {Group.userCount}</p>
      </div>

      <button className="btn btn-view-users" onClick={handleViewGroupUsers}>
        Benutzer dieser Gruppe anzeigen
      </button>
    </div>
  );
};
