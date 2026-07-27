import { useState } from "react";
import { Link } from "react-router-dom";

import "../../styles/sidebar.css";


function AdminSidebar() {

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
                    Payarr Admin
                </h2>


                <nav className="sidebar-menu">

                    <Link
                        className="sidebar-link"
                        to="/admin"
                        onClick={() => setOpen(false)}
                    >
                        Dashboard
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/admin/users"
                        onClick={() => setOpen(false)}
                    >
                        Users
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/admin/settings"
                        onClick={() => setOpen(false)}
                    >
                        Settings
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/admin/payments"
                        onClick={() => setOpen(false)}
                    >
                        Payments
                    </Link>


                    <Link
                        className="sidebar-link"
                        to="/admin/emby"
                        onClick={() => setOpen(false)}
                    >
                        Emby
                    </Link>


                    <hr />


                    <Link
                        className="sidebar-link"
                        to="/"
                        onClick={() => setOpen(false)}
                    >
                        Tillbaka till Portal
                    </Link>

                </nav>

            </aside>

        </>
    );

}


export default AdminSidebar;