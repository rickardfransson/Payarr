import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";


function Account() {

    const { user } = useAuth();


    return (
        <div>

            <h1>
                Account
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
                    title="Username"
                    value={
                        user?.username ?? "-"
                    }
                />


                <StatCard
                    title="Email"
                    value={
                        user?.email ?? "-"
                    }
                />


                <StatCard
                    title="Role"
                    value={
                        user?.role ?? "-"
                    }
                />

            </div>


        </div>
    );
}


export default Account;