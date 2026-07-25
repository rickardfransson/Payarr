import { useEffect, useState } from "react";
import api from "../../api/client";


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

        <div>

            <h1>
                Settings
            </h1>


            <div
                style={{
                    marginTop: "30px"
                }}
            >

                <label>
                    Månadspris
                </label>


                <br />


                <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                />


                <span>
                    {" "}SEK
                </span>


                <br /><br />


                <button
                    onClick={savePrice}
                >
                    Spara
                </button>


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