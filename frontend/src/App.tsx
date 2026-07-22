import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Subscription from "./pages/Subscription";
import Payments from "./pages/Payments";
import Emby from "./pages/Emby";
import Account from "./pages/Account";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import DashboardLayout from "./layout/DashboardLayout";

import AdminUsers from "./admin/pages/AdminUsers";
import AdminDashboard from "./admin/pages/AdminDashboard";



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
    path="/admin"
    element={
        <ProtectedRoute>

            <AdminRoute>

                <AdminDashboard />

            </AdminRoute>

        </ProtectedRoute>
    }
/>

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


                    <Route
                        path="account"
                        element={<Account />}
                    />


                </Route>




                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>

                            <AdminRoute>

                                <AdminUsers />

                            </AdminRoute>

                        </ProtectedRoute>
                    }
                />


            </Routes>


        </BrowserRouter>

    );

}


export default App;