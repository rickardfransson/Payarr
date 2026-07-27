import StatCard from "../components/StatCard";
import { useOverview } from "../hooks/useOverview";

import "../styles/emby.css";


function Emby() {

    const { overview, loading } = useOverview();


    if (loading) {

        return (
            <p>
                Laddar Emby...
            </p>
        );

    }


    const emby = overview?.emby;


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

            <div className="emby-cards">

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