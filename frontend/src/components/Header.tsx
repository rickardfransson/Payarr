import { useAuth } from "../context/AuthContext";


function Header() {

    const { user, logout } = useAuth();


    return (
        <header
            style={{
                padding: "20px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between"
            }}
        >

            <div>
                Payarr Dashboard
            </div>


            <div>

                {user && (
                    <>
                        {user.username}

                        <button
                            onClick={logout}
                            style={{
                                marginLeft: "15px"
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </header>
    );
}


export default Header;