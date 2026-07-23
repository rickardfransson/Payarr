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

import AdminLayout from "./admin/layout/AdminLayout";

import AdminUsers from "./admin/pages/AdminUsers";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUserDetails from "./admin/pages/AdminUserDetails";
import AdminEmby from "./admin/pages/AdminEmby";
import AdminEmbyImport from "./admin/pages/AdminEmbyImport";


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


                    <Route
                        path="account"
                        element={<Account />}
                    />

                </Route>





                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>

                            <AdminRoute>

                                <AdminLayout />

                            </AdminRoute>

                        </ProtectedRoute>
                    }
                >


                    <Route
                        index
                        element={<AdminDashboard />}
                    />



                    <Route
                        path="emby"
                        element={<AdminEmby />}
                    />



                    <Route
                        path="emby/import"
                        element={<AdminEmbyImport />}
                    />



                    <Route
                        path="users"
                        element={<AdminUsers />}
                    />



                    <Route
                        path="users/:id"
                        element={<AdminUserDetails />}
                    />


                </Route>


            </Routes>


        </BrowserRouter>

    );

}


export default App;