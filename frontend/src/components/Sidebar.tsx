import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/sidebar.css";


function Sidebar() {

    const { user } = useAuth();


    return (
        <aside className="sidebar">

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
    );
}


export default Sidebar;