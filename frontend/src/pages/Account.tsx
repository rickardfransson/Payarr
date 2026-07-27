import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";

import StatCard from "../components/StatCard";

import "../styles/account.css";


function Account() {

    const { user } = useAuth();


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");



    async function handleChangePassword() {

        try {

            setMessage("");
            setError("");


            const response = await api.post(
                "/account/change-password",
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                }
            );


            if (response.data.success) {

                setMessage(
                    "Lösenordet är uppdaterat"
                );

                setCurrentPassword("");
                setNewPassword("");

            } else {

                setError(
                    response.data.message
                );

            }


        } catch (err) {

            console.error(err);

            setError(
                "Kunde inte uppdatera lösenord"
            );

        }

    }



    return (
        <div>

            <h1>
                Account
            </h1>


            <div className="account-cards">

                <StatCard
                    title="Username"
                    value={
                        user?.username ?? "-"
                    }
                />


                <StatCard
                    title="Email"
                    value={
                        user?.email ?? "-"
                    }
                />


                <StatCard
                    title="Role"
                    value={
                        user?.role ?? "-"
                    }
                />

            </div>



            <div className="account-password">

                <h2>
                    Byt lösenord
                </h2>


                <input
                    className="account-input"
                    type="password"
                    placeholder="Nuvarande lösenord"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                />


                <input
                    className="account-input"
                    type="password"
                    placeholder="Nytt lösenord"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                />


                <button
                    className="account-button"
                    onClick={handleChangePassword}
                >
                    Uppdatera lösenord
                </button>



                {message && (

                    <p className="account-success">
                        {message}
                    </p>

                )}



                {error && (

                    <p className="account-error">
                        {error}
                    </p>

                )}


            </div>


        </div>
    );
}


export default Account;