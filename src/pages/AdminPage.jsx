import AttendanceList from "../components/AttendanceList";

export default function AdminPage() {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Panel de Administrador</h2>
      <AttendanceList />
    </div>
  );
}
