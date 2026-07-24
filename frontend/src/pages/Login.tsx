import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";


function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    
    const handleLogin = async () => {
        try {
            setError("");

            const data = new URLSearchParams();
            data.append("username", username);
            data.append("password", password);


            const response = await api.post(
                "/auth/login",
                data,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                }
            );

login(response.data.access_token);


if (response.data.must_change_password) {

    navigate("/change-password");

} else {

    navigate("/");

}

        } catch (err) {
            console.error(err);
            setError("Fel användarnamn eller lösenord");
        }
    };


    return (
        <div style={{ padding: "40px" }}>
            <h1>Payarr Login</h1>


            <input
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(e.target.value)
                }
            />


            <br /><br />


            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />


            <br /><br />


            <button onClick={handleLogin}>
                Logga in
            </button>


            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

        </div>
    );
}


export default Login;