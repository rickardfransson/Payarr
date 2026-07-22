import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/header.css";


function Header() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();



    function handleLogout() {

        logout();

        navigate("/login");

    }



    return (
        <header className="header">


            <h2>
                Payarr
            </h2>



            <div className="header-user">


                <span>
                    {user?.username}
                </span>



                <button
                    className="header-button"
                    onClick={handleLogout}
                >
                    Logga ut
                </button>


            </div>


        </header>
    );
}


export default Header;