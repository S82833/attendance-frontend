import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

export default function LoginPage() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
      const role = email.includes("admin") ? "admin" : "employee";
      navigate(`/${role}`);
    } catch (err) {
      setErrorMessage("Credenciales incorrectas o usuario no registrado.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Iniciar Sesión</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={isSigningIn}>
          {isSigningIn ? "Iniciando sesión..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
