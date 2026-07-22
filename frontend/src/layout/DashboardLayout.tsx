import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import "../styles/layout.css";


function DashboardLayout() {

    return (
        <div className="dashboard-layout">

            <Sidebar />


            <div className="dashboard-content">

                <Header />


                <main className="dashboard-main">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}


export default DashboardLayout;