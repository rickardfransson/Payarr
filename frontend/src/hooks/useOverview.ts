import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../api/client";


interface Overview {

    user_id: number;

    username: string;

    role: string;


    emby_access: {
        enabled: boolean;
        unlimited: boolean;
    };


    subscription?: {
        active: boolean;
        end_date: string | null;
    };


    last_payment?: {
        amount: number;
        status: string;
        provider: string;
        paid_at?: string;
    };


    emby?: {
        username: string;
        active: boolean;
    };

}



export function useOverview() {

    const { user } = useAuth();


    const [overview, setOverview] = useState<Overview | null>(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        async function loadOverview() {

            if (!user) {
                return;
            }


            try {

                const response = await api.get(
                    `/users/${user.id}/overview`
                );


                setOverview(response.data);


            } catch (error) {

                console.error(
                    "Kunde inte hämta overview",
                    error
                );

            } finally {

                setLoading(false);

            }

        }


        loadOverview();


    }, [user]);



    return {
        overview,
        loading
    };

}