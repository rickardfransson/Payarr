import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";


function Subscription() {

    const { overview, loading } = useOverview();


    if (loading) {

        return (
            <p>
                Laddar subscription...
            </p>
        );

    }



    const subscription = overview?.subscription;



    if (!subscription) {

        return (
            <div>

                <h1>
                    Subscription
                </h1>


                <p>
                    Ingen aktiv prenumeration hittades.
                </p>

            </div>
        );

    }



    return (
        <div>

            <h1>
                Subscription
            </h1>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <StatCard
                    title="Status"
                    value={
                        subscription.active
                            ? "Aktiv"
                            : "Inaktiv"
                    }
                    description="Prenumerationsstatus"
                />


                <StatCard
                    title="Slutdatum"
                    value={
                        subscription.end_date
                    }
                />

            </div>

        </div>
    );
}


export default Subscription;