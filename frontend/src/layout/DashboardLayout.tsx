import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


function DashboardLayout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <Sidebar />

            <div style={{ flex: 1 }}>

                <Header />

                <main style={{ padding: "20px" }}>
                    <Outlet />
                </main>

            </div>

        </div>
    );
}


export default DashboardLayout;