import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import StatCard from "../components/StatCard";


interface EmbyData {
    username: string;
    active: boolean;
}


function Emby() {

    const { user } = useAuth();

    const [emby, setEmby] = useState<EmbyData | null>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        async function loadEmby() {

            if (!user) {
                return;
            }


            try {

                const response = await api.get(
                    `/users/${user.id}/overview`
                );


                setEmby(
                    response.data.emby ?? null
                );


            } catch (error) {

                console.error(
                    "Kunde inte hämta Emby-data",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadEmby();

    }, [user]);



    if (loading) {

        return (
            <p>
                Laddar Emby...
            </p>
        );

    }



    if (!emby) {

        return (
            <div>

                <h1>
                    Emby
                </h1>


                <p>
                    Ingen Emby-koppling hittades.
                </p>

            </div>
        );

    }



    return (
        <div>

            <h1>
                Emby
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
                        emby.active
                            ? "Ansluten"
                            : "Inaktiv"
                    }
                    description="Emby-konto"
                />


                <StatCard
                    title="Username"
                    value={
                        emby.username
                    }
                />

            </div>


        </div>
    );
}


export default Emby;