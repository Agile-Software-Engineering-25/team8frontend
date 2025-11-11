# Frontend – Technische & Nutzer-Dokumentation


---

## Technische Dokumentation

### Übersicht

Die Kommunikation zwischen Frontend und Backend erfolgt in diesem Projekt über klar definierte API-Endpunkte. Für jede Kernfunktion (z. B. Benutzer verwalten, Rollen bearbeiten) bestehen eigene Funktionen, die mittels `axios` oder `fetch` die Daten synchronisieren.

---

### 1. Rollenverwaltung

**a) Rollen anzeigen**

- **Endpoint:** `GET /api/roles`
- **Funktion:** Lädt alle Rollen inkl. Name, Typ und Nutzeranzahl.
- **Verwendung:** Wird beim Laden der Startseite (`Startseite.tsx`) automatisch ausgeführt und bei Such-/Filteraktionen erneut aufgerufen.
- **Response:**  
  ```json
  [{ "id": 1, "name": "Administrator", "standardRole": "Admin", "userCount": 2 }, ...]
  ```

---

**b) Rollendetails anzeigen**

- **Endpoint:** `GET /api/role/{roleId}`
- **Funktion:** Holt Details einer einzelnen Rolle inkl. Berechtigungen und Nutzer.
- **Verwendung:** Nach Klick auf eine Rolle aus der Übersicht oder beim direkten Navigieren auf eine Rollendetailseite.
- **Response:**
  ```json
  { "id": 4, "name": "Redaktion", "permissions": [ ... ], "users": [ ... ] }
  ```

---

### 2. Benutzerverwaltung

**a) Nutzer einer Rolle anzeigen**

- **Endpoint:** `GET /api/role/{roleId}/users`
- **Funktion:** Listet alle Benutzer auf, die einer bestimmten Rolle zugeordnet sind.
- **Verwendung:** Anzeige in der Rollen-Detailansicht und in Benutzerverwaltungsmodulen.
- **Response:**  
  ```json
  [{ "id": "ab12", "username": "max", "email": "max@orga.de", "enabled": true }, ...]
  ```

---

**b) Alle verfügbaren Nutzer auflisten (für Auswahl/Hinzufügen)**

- **Endpoint:** `GET /api/users`
- **Funktion:** Liefert alle Benutzer (z. B. für „Benutzer zur Rolle hinzufügen“-Dialog).
- **Response:**  
  ```json
  [{ "id": "10", "username": "anna.m", "email": "anna.m@example.com" }, ...]
  ```

---

**c) Benutzer zu Rolle hinzufügen**

- **Endpoint:** `POST /api/role/{roleId}/users`
- **Payload:**  
  ```json
  { "userId": "10" }
  ```
- **Verwendung:** Nach Auswahl eines Benutzers im „Benutzer hinzufügen“-Dialog wird diese Anfrage gesendet. UI aktualisiert sich automatisch danach.

---

**d) Benutzer aus Rolle entfernen**

- **Endpoint:** `DELETE /api/role/{roleId}/users/{userId}`
- **Verwendung:** Klick auf „Entfernen“-Button neben dem Benutzer. Nach Bestätigung wird der Benutzer entfernt und die UI aktualisiert.

---

### 3. Berechtigungen (Permissions)

**a) Alle verfügbaren Berechtigungen laden**

- **Endpoint:** `GET /api/permissions`
- **Funktion:** Holt alle möglichen Berechtigungs-Typen (z. B. „Bearbeiten“, „Löschen“ etc.).
- **Verwendung:** Wird in Editiermasken für Rollen verwendet, um Aktionen in Drop-Downs oder Drag & Drop anzubieten.

---

**b) Berechtigung zu Rolle hinzufügen**

- **Endpoint:** `POST /api/role/{roleId}/permissions`
- **Payload:**  
  ```json
  { "permissionId": "perm-3" }
  ```
- **Verwendung:** Drag-and-Drop oder Button-Klick auf eine Berechtigung im Editiermodus.

---

**c) Berechtigung aus Rolle entfernen**

- **Endpoint:** `DELETE /api/role/{roleId}/permissions/{permissionId}`
- **Verwendung:** Klick auf das „Entfernen“-Icon bei einer Berechtigung in der Liste. UI aktualisiert sich.

---

### Fehler- und Status-Handling

- Während Requests werden Ladeindikatoren angezeigt.
- Bei Fehlern werden Fehlermeldungen ausgegeben (z. B. Netzwerkfehler).
- Nach erfolgreichen Änderungen werden Listen und Anzeigen automatisch aktualisiert.

---

## Nutzer-Dokumentation

### Startseite

- **Was sehe ich?**  
  Sie sehen eine Liste aller vorhandenen Rollen mit Namen, Typ und Anzahl der zugeordneten Nutzer.
- **Wie kann ich suchen und filtern?**  
  Nutzen Sie das Suchfeld oben, um Rollen nach Namen zu durchsuchen. Mit dem Dropdown-Menü daneben filtern Sie nach Rollentyp (z. B. „Admin“, „Student“).

### Rolle öffnen & Details

- **Wie?**  
  Klick auf eine Rolle öffnet die Detailansicht.
- **Was sehe ich?**  
  Eine Liste aller aktuell zugeordneten Benutzer und die Berechtigungen der Rolle.

### Benutzer hinzufügen

- **Wie?**  
  In der Detailansicht finden Sie einen Button „Benutzer hinzufügen“. Klick darauf öffnet einen Dialog mit allen verfügbaren Benutzern.
- **Wie funktioniert das?**  
  Sie können in der Liste suchen oder filtern. Ein Klick auf einen Benutzer fügt diesen der Rolle hinzu. Die Liste in der Detailansicht aktualisiert sich automatisch.

### Benutzer entfernen

- **Wie?**  
  Neben jedem Benutzer gibt es einen „Entfernen“-Button. Nach Bestätigung wird der Benutzer dauerhaft von dieser Rolle entfernt.

### Berechtigungen verwalten

- **Wie?**  
  Unter „Berechtigungen“ können Sie mit Drag & Drop oder Schaltflächen neue Berechtigungen hinzufügen oder entfernen.
- **Was passiert dann?**  
  Jede Änderung wird sofort an das Backend übertragen und die UI zeigt den aktuellen Zustand.

### Fehlermeldungen & Ladeanzeigen

- Während Daten geladen oder gespeichert werden, sehen Sie entsprechende Ladeanzeigen.
- Bei Fehlern erhalten Sie direkt eine klare Fehlermeldung mit Hinweisen zur Behebung (z. B. „Netzwerkfehler – bitte Seite neu laden“).

---

