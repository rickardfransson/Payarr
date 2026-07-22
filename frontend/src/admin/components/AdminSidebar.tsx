import { Link } from "react-router-dom";

import "../../styles/sidebar.css";


function AdminSidebar() {

    return (

        <aside className="sidebar">

            <h2 className="sidebar-title">
                Payarr Admin
            </h2>


            <nav className="sidebar-menu">


                <Link
                    className="sidebar-link"
                    to="/admin"
                >
                    Dashboard
                </Link>


                <Link
                    className="sidebar-link"
                    to="/admin/users"
                >
                    Users
                </Link>



                <hr />



                <Link
                    className="sidebar-link"
                    to="/"
                >
                    Tillbaka till Portal
                </Link>


            </nav>


        </aside>

    );

}


export default AdminSidebar;