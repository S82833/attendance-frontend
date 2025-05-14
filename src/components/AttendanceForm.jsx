import { useState } from "react";
import { useAuth } from "../contexts/authContext/index"
import { useEffect } from "react";

export default function AttendanceForm() {
    const { currentUser } = useAuth();
    const [uid, setUid] = useState("");
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        getLocation();
        setUid(currentUser.email);
    }, []);
    
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("uid", uid);
        formData.append("lat", lat);
        formData.append("lng", lng);
        formData.append("image", image);

        try {
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
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />
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
            <button type="submit" className="btn btn-success">
            Enviar Asistencia
            </button>
        </form>

        {status && <div className="alert alert-info mt-3">{status}</div>}
        </div>
    );
}
