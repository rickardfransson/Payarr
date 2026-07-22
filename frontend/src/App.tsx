import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subscription from "./pages/Subscription";
import Payments from "./pages/Payments";
import Emby from "./pages/Emby";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={<Dashboard />}
                    />


                    <Route
                        path="subscription"
                        element={<Subscription />}
                    />


                    <Route
                        path="payments"
                        element={<Payments />}
                    />


                    <Route
                        path="emby"
                        element={<Emby />}
                    />

                </Route>


            </Routes>

        </BrowserRouter>
    );
}


export default App;