import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/sidebar.css";


function Sidebar() {

    const { user } = useAuth();

    const [open, setOpen] = useState(false);


    return (
        <>

            <button
                className="sidebar-toggle"
                onClick={() => setOpen(!open)}
            >
                ☰
            </button>


            <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>

                <h2 className="sidebar-title">
                    Payarr
                </h2>


                <nav className="sidebar-menu">

                    <Link
                        className="sidebar-link"
                        to="/"
                    >
                        Dashboard
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/subscription"
                    >
                        Subscription
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/payments"
                    >
                        Payments
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/emby"
                    >
                        Emby
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/account"
                    >
                        Account
                    </Link>


                    {
                        user?.role === "admin" && (

                            <>

                                <Link
                                    className="sidebar-link"
                                    to="/admin"
                                >
                                    Admin Dashboard
                                </Link>


                                <Link
                                    className="sidebar-link"
                                    to="/admin/users"
                                >
                                    Users
                                </Link>

                            </>

                        )
                    }

                </nav>

            </aside>

        </>
    );
}


export default Sidebar;