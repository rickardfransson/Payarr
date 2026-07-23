import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/client";

import "../../styles/admin.css";


function AdminUserDetails() {

    const { id } = useParams();

    const [user, setUser] = useState<any>(null);
    const [embyStatus, setEmbyStatus] = useState<any>(null);

    const [subscriptionDate, setSubscriptionDate] =
        useState("");



    async function loadUser() {

        try {

            const response = await api.get(
                `/users/${id}/overview`
            );

            setUser(response.data);


            if (response.data.subscription?.end_date) {

                setSubscriptionDate(
                    response.data.subscription.end_date.substring(0, 10)
                );

            }


        } catch (error) {

            console.error(
                "Kunde inte hämta användare",
                error
            );

        }

    }



    async function loadEmbyStatus() {

        try {

            const response = await api.get(
                `/emby/accounts/${id}/details`
            );

            setEmbyStatus(response.data);

        } catch (error) {

            console.error(
                "Kunde inte hämta Emby-status",
                error
            );

        }

    }



    async function enableEmby() {

        await api.post(
            `/emby/accounts/${id}/enable`
        );

        await loadEmbyStatus();

    }



    async function disableEmby() {

        await api.post(
            `/emby/accounts/${id}/disable`
        );

        await loadEmbyStatus();

    }



    async function syncUser() {

        await api.post(
            `/emby/sync/${id}`
        );

    }



    async function saveSubscription() {

        try {

            await api.post(
                `/admin/users/${id}/activate-subscription`,
                {
                    end_date: subscriptionDate
                }
            );


            await loadUser();


        } catch(error) {

            console.error(
                "Kunde inte uppdatera subscription",
                error
            );

        }

    }




    useEffect(() => {

        loadUser();
        loadEmbyStatus();

    }, [id]);





    if (!user) {

        return (
            <p>
                Laddar användare...
            </p>
        );

    }





    return (

        <div className="admin-page">


            <h1 className="admin-title">
                {user.username}
            </h1>



            <div className="admin-grid">



                <section className="admin-card">

                    <h2>
                        Account
                    </h2>


                    <div className="admin-row">
                        <span className="admin-label">
                            User ID
                        </span>

                        <span>
                            {user.user_id}
                        </span>
                    </div>


                    <div className="admin-row">
                        <span className="admin-label">
                            Username
                        </span>

                        <span>
                            {user.username}
                        </span>
                    </div>


                    <div className="admin-row">
                        <span className="admin-label">
                            Email
                        </span>

                        <span>
                            {user.email ?? "-"}
                        </span>
                    </div>


                </section>





                <section className="admin-card">

                    <h2>
                        Subscription
                    </h2>


                    <div className="admin-row">

                        <span className="admin-label">
                            Status
                        </span>

                        <span>
                            {
                                user.subscription?.active
                                    ? "Aktiv"
                                    : "Inaktiv"
                            }
                        </span>

                    </div>



                    <div className="admin-row">

                        <span className="admin-label">
                            Utgångsdatum
                        </span>


                        <input
                            type="date"
                            value={subscriptionDate}
                            onChange={(e) =>
                                setSubscriptionDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>



                    <div className="admin-actions">

                        <button
                            className="admin-button"
                            onClick={saveSubscription}
                            disabled={!subscriptionDate}
                        >
                            Spara abonnemang
                        </button>

                    </div>


                </section>







                <section className="admin-card">


                    <h2>
                        Emby
                    </h2>


                    {
                        user.emby ? (

                            <>

                                <div className="admin-row">

                                    <span className="admin-label">
                                        Username
                                    </span>

                                    <span>
                                        {user.emby.username}
                                    </span>

                                </div>



                                <div className="admin-row">

                                    <span className="admin-label">
                                        Status
                                    </span>

                                    <span>

                                        {
                                            embyStatus?.Policy?.IsDisabled
                                                ? "Inaktiverad"
                                                : "Aktiv"
                                        }

                                    </span>

                                </div>



                                <div className="admin-actions">

                                    <button
                                        className="admin-button"
                                        onClick={loadEmbyStatus}
                                    >
                                        Uppdatera
                                    </button>


                                    <button
                                        className="admin-button"
                                        onClick={enableEmby}
                                    >
                                        Aktivera
                                    </button>


                                    <button
                                        className="admin-button"
                                        onClick={disableEmby}
                                    >
                                        Inaktivera
                                    </button>


                                    <button
                                        className="admin-button"
                                        onClick={syncUser}
                                    >
                                        Sync
                                    </button>


                                </div>


                            </>

                        ) : (

                            <p>
                                Ingen Emby-koppling
                            </p>

                        )

                    }


                </section>







                <section className="admin-card">

                    <h2>
                        Senaste betalning
                    </h2>


                    {
                        user.last_payment ? (

                            <>

                                <div className="admin-row">

                                    <span className="admin-label">
                                        Belopp
                                    </span>

                                    <span>
                                        {user.last_payment.amount} SEK
                                    </span>

                                </div>


                                <div className="admin-row">

                                    <span className="admin-label">
                                        Status
                                    </span>

                                    <span>
                                        {user.last_payment.status}
                                    </span>

                                </div>


                                <div className="admin-row">

                                    <span className="admin-label">
                                        Provider
                                    </span>

                                    <span>
                                        {user.last_payment.provider}
                                    </span>

                                </div>

                            </>

                        ) : (

                            <p>
                                Ingen betalning
                            </p>

                        )

                    }


                </section>



            </div>


        </div>

    );

}


export default AdminUserDetails;