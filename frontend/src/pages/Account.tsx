import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";

import StatCard from "../components/StatCard";


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



            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

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



            <div
                style={{
                    marginTop: "40px"
                }}
            >

                <h2>
                    Byt lösenord
                </h2>


                <input
                    type="password"
                    placeholder="Nuvarande lösenord"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                />


                <br /><br />


                <input
                    type="password"
                    placeholder="Nytt lösenord"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                />


                <br /><br />


                <button
                    onClick={handleChangePassword}
                >
                    Uppdatera lösenord
                </button>



                {message && (

                    <p
                        style={{
                            color: "green"
                        }}
                    >
                        {message}
                    </p>

                )}



                {error && (

                    <p
                        style={{
                            color: "red"
                        }}
                    >
                        {error}
                    </p>

                )}


            </div>


        </div>
    );
}


export default Account;