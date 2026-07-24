import { useEffect, useState } from "react";
import api from "../../api/client";


function AdminPayments() {

    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const loadPayments = async () => {

        try {

            const response = await api.get(
                "/admin/payments/"
            );

            setPayments(response.data);

        } catch (error) {

            console.error(
                "Kunde inte hämta betalningar",
                error
            );

        } finally {

            setLoading(false);

        }
    };



    const completePayment = async (
        id: number
    ) => {

        try {

            await api.post(
                `/admin/payments/complete/${id}`
            );

            await loadPayments();

        } catch (error) {

            console.error(
                "Kunde inte slutföra betalning",
                error
            );

        }

    };



    useEffect(() => {

        loadPayments();

    }, []);



    if (loading) {

        return (
            <p>
                Laddar betalningar...
            </p>
        );

    }



    return (

        <div>

            <h1>
                Betalningar
            </h1>


            <p>
                Totalt antal betalningar: {payments.length}
            </p>



            <div
                style={{
                    marginTop: "30px",
                    overflowX: "auto"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#fff"
                    }}
                >

                    <thead>

                        <tr>

                            <th style={cellHeader}>
                                ID
                            </th>

                            <th style={cellHeader}>
                                Användare
                            </th>

                            <th style={cellHeader}>
                                Belopp
                            </th>

                            <th style={cellHeader}>
                                Leverantör
                            </th>

                            <th style={cellHeader}>
                                Status
                            </th>

                            <th style={cellHeader}>
                                Skapad
                            </th>

                            <th style={cellHeader}>
                                Åtgärd
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {payments.map(
                            (payment) => (

                            <tr key={payment.id}>

                                <td style={cell}>
                                    {payment.id}
                                </td>


                                <td style={cell}>
                                    {payment.username}
                                </td>


                                <td style={cell}>
                                    {payment.amount} {payment.currency}
                                </td>


                                <td style={cell}>
                                    {payment.provider}
                                </td>


                                <td style={cell}>

                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            fontSize: "0.85rem",
                                            background:
                                                payment.status === "paid"
                                                    ? "#d4edda"
                                                    : "#fff3cd"
                                        }}
                                    >
                                        {payment.status}
                                    </span>

                                </td>


                                <td style={cell}>

                                    {
                                        new Date(
                                            payment.created_at
                                        ).toLocaleString(
                                            "sv-SE"
                                        )
                                    }

                                </td>


                                <td style={cell}>

                                    {payment.status !== "paid" && (

                                        <button
                                            onClick={() =>
                                                completePayment(
                                                    payment.id
                                                )
                                            }
                                        >
                                            Markera betald
                                        </button>

                                    )}

                                </td>


                            </tr>

                        ))}

                    </tbody>


                </table>

            </div>


        </div>

    );

}



const cellHeader = {

    textAlign: "left" as const,
    padding: "12px",
    borderBottom: "2px solid #ddd"

};


const cell = {

    padding: "12px",
    borderBottom: "1px solid #eee"

};


export default AdminPayments;