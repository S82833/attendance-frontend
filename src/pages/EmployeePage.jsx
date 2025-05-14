import AttendanceForm from "../components/AttendanceForm";
import { useAuth } from "../contexts/authContext/index";

export default function EmployeePage() {
    const { currentUser } = useAuth();
    return (
        <div className="container py-4">
        <h2 className="mb-4">Bienvenido {currentUser.email}</h2>
        <AttendanceForm />
        </div>
    );
}
