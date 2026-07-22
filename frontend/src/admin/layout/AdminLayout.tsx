import { Outlet } from "react-router-dom";

import Header from "../../components/Header";
import AdminSidebar from "../components/AdminSidebar";

import "../../styles/layout.css";


function AdminLayout() {

    return (
        <div className="dashboard-layout">

            <AdminSidebar />


            <div className="dashboard-content">

                <Header />


                <main className="dashboard-main">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}


export default AdminLayout;