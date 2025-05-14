import { useEffect, useState } from "react";

export default function AttendanceList() {
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    fetch("https://www.api.talentedgeperu.com/attendances/")
      .then((res) => res.json())
      .then((data) => setAttendances(data.attendances || []));
  }, []);

  return (
    <div className="card p-4 shadow">
      <h3 className="mb-4">Asistencias Registradas</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>UID</th>
              <th>Fecha</th>
              <th>Imagen</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No hay asistencias registradas.</td>
              </tr>
            ) : (
              attendances.map((a) => (
                <tr key={a.id}>
                    <td>{a.user_id}</td>
                    <td>{new Date(a.timestamp).toLocaleString()}</td>
                    <td>
                        <img src={a.photo_url} alt="foto" width="100" className="img-thumbnail" />
                    </td>
                    <td>
                        <a
                            href={`https://www.google.com/maps?q=${a.location.lat},${a.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver ubicación
                        </a>
                    </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
