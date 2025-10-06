// src/components/RoleCard.tsx

import React from 'react';

// ANPASSUNG: isDefault (boolean) wird zu standardRole (string)
export interface UserRole {
  id: number;
  name: string;
  standardRole: string; // z.B. "Student", "Dozent" oder "" für eine benutzerdefinierte Rolle
  userCount: number;
}

interface RoleCardProps {
  role: UserRole;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const isCustomRole = role.standardRole === '';

  return (
    <div className="role-card">
      <div className="card-content">
        <h3 className="role-name">{role.name}</h3>
        
        {/* ANPASSUNG: Zeigt jetzt den Inhalt von standardRole an, wenn vorhanden */}
        <span className={`role-badge ${isCustomRole ? 'custom' : 'default'}`}>
          {isCustomRole ? 'Eigene Rolle' : role.standardRole}
        </span>
        
        <p className="user-count">Anzahl Personen: {role.userCount}</p>
      </div>
      <button className="btn btn-view-users">Benutzer Anzeigen</button>
    </div>
  );
};