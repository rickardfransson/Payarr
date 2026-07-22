import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useOverview } from "../hooks/useOverview";


function Dashboard() {

    const { user } = useAuth();

    const { overview, loading } = useOverview();



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
                        overview?.emby
                            ? "Ansluten"
                            : "Ej ansluten"
                    }
                    description={
                        overview?.emby
                            ? overview.emby.username
                            : "Ingen koppling"
                    }
                />

            </div>


        </div>
    );
}


export default Dashboard;