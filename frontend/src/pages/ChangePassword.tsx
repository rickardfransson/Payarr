import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";


function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async () => {

        try {

            setError("");
            setMessage("");

            const response = await api.post(
                "/account/change-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                }
            );


            if (!response.data.success) {
                setError(response.data.message);
                return;
            }


            setMessage(
                "Lösenord uppdaterat"
            );


            setTimeout(() => {
                navigate("/");
            }, 1000);


        } catch (err) {

            console.error(err);

            setError(
                "Kunde inte byta lösenord"
            );
        }
    };


    return (
        <div style={{ padding: "40px" }}>

            <h1>
                Byt lösenord
            </h1>


            <p>
                Du måste byta lösenord innan du kan fortsätta.
            </p>


            <input
                type="password"
                placeholder="Nuvarande lösenord"
                value={currentPassword}
                onChange={(e) =>
                    setCurrentPassword(e.target.value)
                }
            />


            <br /><br />


            <input
                type="password"
                placeholder="Nytt lösenord"
                value={newPassword}
                onChange={(e) =>
                    setNewPassword(e.target.value)
                }
            />


            <br /><br />


            <button onClick={handleSubmit}>
                Spara nytt lösenord
            </button>


            {message && (
                <p>
                    {message}
                </p>
            )}


            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

        </div>
    );
}


export default ChangePassword;