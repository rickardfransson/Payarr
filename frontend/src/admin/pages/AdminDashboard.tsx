import { useEffect, useState } from "react";

import api from "../../api/client";
import StatCard from "../../components/StatCard";

import "../../styles/admin.css";


interface DashboardData {

    users: number;

    active_subscriptions: number;

    payments_total: number;

    emby_accounts: number;

}



function AdminDashboard() {


    const [data, setData] = useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {


        async function loadDashboard() {

            try {

                const response = await api.get(
                    "/admin/dashboard"
                );


                setData(
                    response.data
                );


            } catch (error) {

                console.error(
                    "Kunde inte hämta admin dashboard",
                    error
                );


            } finally {

                setLoading(false);

            }

        }


        loadDashboard();


    }, []);




    if (loading) {

        return (
            <p>
                Laddar admin dashboard...
            </p>
        );

    }




    return (

        <div className="admin-page">


            <h1 className="admin-title">
                Admin Dashboard
            </h1>



            <div className="admin-grid">


                <div className="admin-card">

                    <StatCard
                        title="Users"
                        value={
                            String(data?.users ?? 0)
                        }
                    />

                </div>



                <div className="admin-card">

                    <StatCard
                        title="Aktiva subscription"
                        value={
                            String(
                                data?.active_subscriptions ?? 0
                            )
                        }
                    />

                </div>




                <div className="admin-card">

                    <StatCard
                        title="Payments"
                        value={
                            String(
                                data?.payments_total ?? 0
                            )
                        }
                    />

                </div>




                <div className="admin-card">

                    <StatCard
                        title="Emby Accounts"
                        value={
                            String(
                                data?.emby_accounts ?? 0
                            )
                        }
                    />

                </div>



            </div>


        </div>

    );

}


export default AdminDashboard;