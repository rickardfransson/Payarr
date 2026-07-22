import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";


function Payments() {

    const { overview, loading } = useOverview();


    if (loading) {

        return (
            <p>
                Laddar payments...
            </p>
        );

    }



    const payment = overview?.last_payment;



    if (!payment) {

        return (
            <div>

                <h1>
                    Payments
                </h1>


                <p>
                    Ingen betalning hittades.
                </p>

            </div>
        );

    }



    return (
        <div>

            <h1>
                Payments
            </h1>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <StatCard
                    title="Belopp"
                    value={`${payment.amount} SEK`}
                />


                <StatCard
                    title="Status"
                    value={payment.status}
                />


                <StatCard
                    title="Provider"
                    value={payment.provider}
                />

            </div>


            {payment.paid_at && (

                <p
                    style={{
                        marginTop: "20px"
                    }}
                >
                    Betald:
                    {" "}
                    {payment.paid_at}
                </p>

            )}


        </div>
    );
}


export default Payments;