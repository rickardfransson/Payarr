import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useOverview } from "../hooks/useOverview";
import "../styles/dashboard.css";


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



    const isUnlimitedEmby =
        overview?.emby_access?.unlimited === true;



    return (
        <div>

            <h1>
                Välkommen {user?.username}
            </h1>


            <p>
                Din Payarr översikt
            </p>



            <div className="dashboard-cards">

                <StatCard
                    title="Subscription"
                    value={
                        isUnlimitedEmby
                            ? "Admin"
                            : overview?.subscription?.active
                                ? "Aktiv"
                                : "Ej aktiv"
                    }
								description={
									isUnlimitedEmby
										? "Obegränsad åtkomst"
										: overview?.subscription
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
