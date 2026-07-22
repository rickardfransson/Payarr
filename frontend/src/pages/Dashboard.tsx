import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import StatCard from "../components/StatCard";


interface Overview {
    subscription?: {
        active: boolean;
        end_date: string;
    };

last_payment?: {
    amount: number;
    status: string;
    provider: string;
    paid_at?: string;
};

    emby?: {
        connected: boolean;
        username?: string;
    };
}


function Dashboard() {

    const { user } = useAuth();

    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function loadOverview() {

            if (!user) {
                return;
            }


            try {

                const response = await api.get(
                    `/users/${user.id}/overview`
                );


                setOverview(response.data);


            } catch (error) {

                console.error(
                    "Kunde inte hämta dashboard data",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadOverview();

    }, [user]);


    if (loading) {
        return (
            <p>
                Laddar dashboard...
            </p>
        );
    }


    return (
        <div>

            <h1>
                Välkommen {user?.username}
            </h1>


            <p>
                Din Payarr översikt
            </p>



            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <StatCard
                    title="Subscription"
                    value={
                        overview?.subscription?.active
                            ? "Aktiv"
                            : "Ej aktiv"
                    }
                    description={
                        overview?.subscription
                            ? `Slutar ${overview.subscription.end_date}`
                            : "Ingen prenumeration"
                    }
                />



<StatCard
    title="Payments"
    value={
        overview?.last_payment
            ? `${overview.last_payment.amount} SEK`
            : "Ingen"
    }
    description={
        overview?.last_payment
            ? overview.last_payment.status
            : "Ingen betalning"
    }
/>



                <StatCard
                    title="Emby"
                    value={
                        overview?.emby?.connected
                            ? "Ansluten"
                            : "Ej ansluten"
                    }
                    description={
                        overview?.emby?.username
                            ? overview.emby.username
                            : "Ingen Emby-koppling"
                    }
                />

            </div>

        </div>
    );
}


export default Dashboard;