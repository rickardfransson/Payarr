import { useEffect, useState } from "react";

import api from "../../api/client";

import "../../styles/admin.css";


function AdminSettings() {

    const [price, setPrice] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);



    const loadSettings = async () => {

        try {

            const response = await api.get(
                "/admin/settings/"
            );

            setPrice(
                response.data.subscription_price.toString()
            );


        } catch (error) {

            console.error(
                "Kunde inte hämta inställningar",
                error
            );


        } finally {

            setLoading(false);

        }

    };



    const savePrice = async () => {

        try {

            await api.post(
                "/admin/settings/subscription-price",
                {
                    price: Number(price),
                }
            );


            setMessage(
                "Inställningen sparad"
            );


        } catch (error) {

            console.error(
                "Kunde inte spara inställning",
                error
            );


            setMessage(
                "Fel vid sparande"
            );

        }

    };



    useEffect(() => {

        loadSettings();

    }, []);




    if (loading) {

        return (
            <p>
                Laddar inställningar...
            </p>
        );

    }



    return (

        <div className="admin-page">


            <h1 className="admin-title">
                Settings
            </h1>



            <div className="admin-card">


                <h2>
                    Prenumerationspris
                </h2>



                <div className="admin-row">


                    <label className="admin-label">
                        Månadspris
                    </label>


                    <div>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                )
                            }
                        />


                        {" "}SEK

                    </div>


                </div>




                <div className="admin-actions">


                    <button
                        className="admin-button"
                        onClick={savePrice}
                    >
                        Spara
                    </button>


                </div>




                {message && (

                    <p>
                        {message}
                    </p>

                )}



            </div>



        </div>

    );

}


export default AdminSettings;