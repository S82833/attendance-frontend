import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import EmployeePage from "./pages/EmployeePage";
import { useAuth } from "./contexts/authContext";

function App() {
  const { userLoggedIn, currentUser } = useAuth();

  const isAdmin = currentUser?.email?.includes("admin");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin"
          element={userLoggedIn && isAdmin ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route
          path="/employee"
          element={userLoggedIn && !isAdmin ? <EmployeePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
