import { useEffect, useState } from "react";

export default function AttendanceList() {
  const [attendances, setAttendances] = useState([]);

  function decimalToDMS(deg, isLat = true) {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesFloat = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = ((minutesFloat - minutes) * 60).toFixed(1);

    const direction = deg >= 0
      ? (isLat ? "N" : "E")
      : (isLat ? "S" : "W");

    return `${degrees}°${String(minutes).padStart(2, '0')}'${String(seconds).padStart(4, '0')}"${direction}`;
  }

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
              <th>Entrada/Salida</th>
              <th>Fecha</th>
              <th>Imagen</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No hay asistencias registradas.</td>
              </tr>
            ) : (
              attendances.map((a) => {
                const date = new Date(a.timestamp.replace(/\.\d+/, ""));
                const hour = date.getUTCHours();
                const entradaSalida = hour < 12 ? "Entrada" : "Salida";
                return (
                  <tr key={a.id}>
                    <td>{a.user_id}</td>
                    <td>{entradaSalida}</td>
                    <td>
                      {date.toLocaleString("es-PE", {
                        timeZone: "UTC",
                        dateStyle: "short",
                        timeStyle: "medium"
                      })}
                    </td>
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
                      <br />
                      <small>
                        {decimalToDMS(a.location.lat, true)}, {decimalToDMS(a.location.lng, false)}
                      </small>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
