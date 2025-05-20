import { useState } from "react";
import { useAuth } from "../contexts/authContext/index"
import { useEffect } from "react";
import imageCompression from "browser-image-compression";


export default function AttendanceForm() {
    const { currentUser } = useAuth();
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [entradaSalida, setEntradaSalida] = useState("Entrada");

    useEffect(() => {
        getLocation();
    }, []);
    
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            },
            (err) => {
                console.error("❌ Error obteniendo ubicación:", err);
                setStatus("🚫 No se pudo obtener tu ubicación.");
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image || !lat || !lng || !currentUser?.email || !entradaSalida) {
            setStatus("🚫 Faltan datos. Asegúrate de tener ubicación y foto.");
            return;
        }

        const formData = new FormData();
        formData.append("uid", currentUser.email);
        formData.append("lat", lat);
        formData.append("lng", lng);
        formData.append("image", image);
        formData.append("entradaSalida", entradaSalida);

        console.log("📸 UID:", currentUser.email);
        console.log("📍 LAT:", lat);
        console.log("📍 LNG:", lng);
        console.log("🖼️ IMAGE:", image);
        console.log("🕒 ENTRADA/SALIDA:", entradaSalida);

        try {
            setLoading(true);
            const res = await fetch("https://www.api.talentedgeperu.com/attendances/", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setStatus("✅ Asistencia registrada correctamente.");
            } else {
                setStatus("❌ Error: " + data.message);
            }
        } catch (err) {
            setStatus("🚫 Error de red: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="card p-4 mb-4 shadow">
            <h3 className="mb-3">Registrar Asistencia</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Foto (JPEG/PNG)</label>
                    <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        className="form-control"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                try {
                                    const options = {
                                        maxSizeMB: 0.5, 
                                        maxWidthOrHeight: 800, 
                                        useWebWorker: true,
                                    };

                                    const compressedFile = await imageCompression(file, options);
                                    setImage(compressedFile);

                                    console.log("📉 Compressed size (KB):", (compressedFile.size / 1024).toFixed(2));
                                } catch (err) {
                                    console.error("❌ Error al comprimir la imagen:", err);
                                }
                            }
                        }}
                        required
                    />
                    <div className="form-check mt-3 d-flex align-items-center">
                        <input 
                            className="form-check-input me-2"
                            type="checkbox"
                            id="entradaSalidaCheck"
                            onChange={(e) => setEntradaSalida(e.target.checked ? "Salida" : "Entrada")}
                        />
                        <label className="form-check-label mb-0" htmlFor="entradaSalidaCheck">Salida</label>
                    </div>
                </div>

                {image && (
                    <div className="mt-3">
                        <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        width="200"
                        className="img-thumbnail"
                        />
                    </div>
                )}
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Asistencia"}
                </button>
            </form>

            {status && <div className="alert alert-info mt-3">{status}</div>}
        </div>
    );
}
