import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export interface UserRole {
  id: number;
  name: string;
  standardRole: string;
  userCount: number;
}

interface RoleCardProps {
  role: UserRole;
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

export const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const isCustomRole = role.standardRole === '';
  const navigate = useNavigate();

  const handleViewBaseUsers = () => {
    navigate(`/base-role/${role.id}`, {
      state: { standardRole: role.standardRole, roleName: role.name },
    });
  };

  const handleViewRoleUsers = () => {
    navigate(`/role-users/${role.id}`, {
      state: { roleName: role.name },
    });
  };

  return (
    <div className="role-card">
      <Link to={`/role/${role.id}`} className="edit-icon">
        <EditIcon />
      </Link>

      <div className="card-header">
        <h3 className="role-name">{role.name}</h3>
      </div>

      <div className="card-content">
        <span className={`role-badge ${isCustomRole ? 'custom' : 'default'}`}>
          {isCustomRole ? 'Eigene Rolle' : role.standardRole}
        </span>
        <p className="user-count">Anzahl Personen: {role.userCount}</p>
      </div>

      <button className="btn btn-view-users" onClick={handleViewBaseUsers}>
        Benutzer dieser Standardrolle anzeigen
      </button>

      <button className="btn btn-view-users" onClick={handleViewRoleUsers}>
        Benutzer dieser Rolle anzeigen
      </button>
    </div>
  );
};
