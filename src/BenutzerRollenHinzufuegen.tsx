import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BenutzerRollenHinzufuegen.css";

// --- Mock: später durch echten API-Call ersetzen ---
type User = {
  id: string;
  firstName: string;
  lastName: string;
  defaultRole: string;
  currentRole: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const mock: User[] = [
    { id: "1", firstName: "Mia",   lastName: "Schneider", defaultRole: "User",    currentRole: "User" },
    { id: "2", firstName: "Lukas", lastName: "Weber",     defaultRole: "User",    currentRole: "Admin" },
    { id: "3", firstName: "Emma",  lastName: "Hoffmann",  defaultRole: "Manager", currentRole: "Manager" },
    { id: "4", firstName: "Jonas", lastName: "Wagner",    defaultRole: "User",    currentRole: "User" },
  ];
  return new Promise((res) => setTimeout(() => res(mock), 150));
};
// ----------------------------------------------------

const roleFrom = (u: User) => `${u.defaultRole}`;
const roleCurr = (u: User) => `${u.currentRole}`;

export const BenutzerRollenHinzufuegen: React.FC = () => {
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filter-States (entsprechen grob deinem Mock)
  const [qRole, setQRole] = useState("");
  const [qName, setQName] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await fetchUsers();
        setAllUsers(data);
      } catch (e) {
        setErr("Fehler beim Laden der Benutzer.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const roleOptions = useMemo(() => {
    const s = new Set(allUsers.map((u) => u.defaultRole).filter(Boolean));
    return Array.from(s);
  }, [allUsers]);

  const filtered = useMemo(() => {
    const nameNeedle = qName.trim().toLowerCase();
    const roleNeedle = qRole.trim().toLowerCase();
    return allUsers.filter((u) => {
      const nameMatch =
        !nameNeedle ||
        u.firstName.toLowerCase().includes(nameNeedle) ||
        u.lastName.toLowerCase().includes(nameNeedle);
      const roleMatch =
        !roleNeedle ||
        roleFrom(u).toLowerCase().includes(roleNeedle) ||
        roleCurr(u).toLowerCase().includes(roleNeedle);
      return nameMatch && roleMatch;
    });
  }, [allUsers, qName, qRole]);

  const allChecked = filtered.length > 0 && filtered.every((u) => selected[u.id]);
  const toggleAll = () => {
    if (allChecked) {
      const c = { ...selected };
      filtered.forEach((u) => delete c[u.id]);
      setSelected(c);
    } else {
      const c = { ...selected };
      filtered.forEach((u) => (c[u.id] = true));
      setSelected(c);
    }
  };
  const toggleOne = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  // Actions
  const onCancel = () => navigate(-1);
  const onAddRoles = () => {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    alert(`Rollen hinzufügen für IDs: ${ids.join(", ") || "—"}`);
  };
  const onSubmit = () => {
    const chosen = allUsers.filter((u) => selected[u.id]);
    // TODO: API-Call – hier nur Demo
    alert(`Absenden: ${chosen.map((u) => `${u.lastName}, ${u.firstName}`).join("; ") || "—"}`);
  };

  return (
    <div className="assign-container">
      <header className="toolbar assign-toolbar">
        {/* Namens-Filter */}
        <input
          type="text"
          placeholder="Suchen… (Name)"
          className="search-input"
          value={qName}
          onChange={(e) => setQName(e.target.value)}
        />
        {/* Rollen-Suche (Dropdown angelehnt an Startseite) */}
        <select
          className="filter-select"
          value={qRole}
          onChange={(e) => setQRole(e.target.value)}
        >
          <option value="">Alle Rollen</option>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* rechte Seite: Primär-Aktion wie in Startseite */}
        <button className="btn btn-secondary" onClick={onAddRoles}>
          Rollen hinzufügen
        </button>
      </header>

      <main className="assign-main">
        {/* Table-Header */}
        <div className="assign-table">
          <div className="assign-thead assign-row">
            <div className="assign-cell checkbox">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} />
            </div>
            <div className="assign-cell">Name</div>
            <div className="assign-cell">Vorname</div>
            <div className="assign-cell">Standardrolle</div>
            <div className="assign-cell">Aktuelle Rolle</div>
          </div>

          {/* Table-Body */}
          {loading && <div className="assign-row muted">Lade Benutzer…</div>}
          {err && <div className="assign-row error">{err}</div>}
          {!loading && !err && filtered.length === 0 && (
            <div className="assign-row muted">Keine Ergebnisse</div>
          )}

          {!loading &&
            !err &&
            filtered.map((u) => (
              <div key={u.id} className="assign-row">
                <div className="assign-cell checkbox">
                  <input
                    type="checkbox"
                    checked={!!selected[u.id]}
                    onChange={() => toggleOne(u.id)}
                    aria-label={`Select ${u.firstName} ${u.lastName}`}
                  />
                </div>
                <div className="assign-cell">{u.lastName}</div>
                <div className="assign-cell">{u.firstName}</div>
                <div className="assign-cell">{roleFrom(u)}</div>
                <div className="assign-cell">{roleCurr(u)}</div>
              </div>
            ))}
        </div>

        {/* „Pill“-Leiste angelehnt an Mock */}
        <div className="assign-pill">
          <span>
            {Object.values(selected).filter(Boolean).length} ausgewählt
          </span>
          <button className="btn btn-secondary" onClick={onAddRoles}>
            Rollen hinzufügen
          </button>
        </div>

        {/* Footer-Aktionen */}
        <div className="assign-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Abbrechen
          </button>
          <button className="btn btn-primary" onClick={onSubmit}>
            Absenden
          </button>
        </div>
      </main>
    </div>
  );
};
export default BenutzerRollenHinzufuegen;

