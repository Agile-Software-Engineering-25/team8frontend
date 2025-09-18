import React, {useState} from 'react';
import type { FormEvent } from 'react';

// Ein einfacher Style, der direkt in der Komponente definiert wird.
// Für größere Projekte würde man dies in eine separate CSS-Datei auslagern.
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column', // TypeScript benötigt hier eine Typ-Zusicherung
    width: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold' as 'bold',
  }
};


// Die eigentliche LoginForm Komponente
const LoginForm: React.FC = () => {
  // State-Variablen für E-Mail und Passwort mit dem useState-Hook
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Funktion, die beim Absenden des Formulars aufgerufen wird
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Verhindert das Standardverhalten des Formulars (Seiten-Neuladen)
    event.preventDefault();

    // Hier würdest du normalerweise die Logik zur Authentifizierung einfügen
    // (z.B. einen API-Aufruf an dein Backend)
    console.log('Login-Daten:', { email, password });
    alert(`Login-Versuch mit E-Mail: ${email}`);

    // Optional: Felder nach dem Absenden zurücksetzen
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      <h2>Login</h2>
      
      <label htmlFor="email" style={styles.label}>E-Mail</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        required // Stellt sicher, dass das Feld ausgefüllt werden muss
      />

      <label htmlFor="password" style={styles.label}>Passwort</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        required
      />

      <button type="submit" style={styles.button}>
        Anmelden
      </button>
    </form>
  );
};

export default LoginForm;