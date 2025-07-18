import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext/index"
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

  const downloadCSV = () => {
    if (attendances.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const header = ["UID", "Entrada/Salida", "Fecha", "Hora", "Foto URL", "Latitud", "Longitud"];

    const rows = attendances.map((a) => {
      const date = new Date(a.timestamp.replace(/\.\d+/, ""));
      const hour = date.getUTCHours();

      const fecha = date.toLocaleDateString("es-PE", { timeZone: "UTC" });
      const hora = date.toLocaleTimeString("es-PE", { timeZone: "UTC" });

      return [
      a.user_id,
      a.entradaSalida,
      fecha,
      hora,
      a.photo_url,
      a.location.lat,
      a.location.lng
      ];
    });

    const csvContent =
      [header, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "asistencias.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { currentUser } = useAuth();
  useEffect(() => {
    if (!currentUser || !currentUser.email) return;

    const allowedDomain = currentUser.email.split("@")[1]; // ejemplo: talentedgeperu.com

    fetch("https://www.api.talentedgeperu.com/attendances/")
      .then((res) => res.json())
      .then((data) => {
        const all = data.attendances || [];

        // solo mantener los registros que tienen ese dominio
        const filtered = all.filter((a) => {
          const userDomain = a.user_id?.split("@")[1];
          return userDomain === allowedDomain;
        });

        setAttendances(filtered);
      })
      .catch((err) => {
        console.error("Error al obtener asistencias:", err);
      });
  }, [currentUser]);


  return (
    <div className="card p-4 shadow">
      <div className="container">
        <div className="row align-items-start">
          <h3 className="mb-4 col-9">Asistencias Registradas</h3>
          <button className="btn btn-primary mb-3 col" onClick={downloadCSV}>
            Descargar CSV
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle">
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
                const entradaSalida = a.entradaSalida;
                return (
                  <tr key={a.id}
                    className={entradaSalida === "Entrada" ? "table-success" : "table-danger"}
                    >
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
                      <a href={a.photo_url} target="_blank" rel="noopener noreferrer">
                        <img src={a.photo_url} alt="foto" width="100" className="img-thumbnail" />
                      </a>
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
