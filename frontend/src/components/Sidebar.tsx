import { Link } from "react-router-dom";

import "../styles/sidebar.css";


function Sidebar() {

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

            </nav>

        </aside>
    );
}


export default Sidebar;