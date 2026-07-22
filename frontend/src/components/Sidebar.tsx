import { Link } from "react-router-dom";


function Sidebar() {
    return (
        <aside
            style={{
                width: "220px",
                padding: "20px",
                borderRight: "1px solid #ddd"
            }}
        >

            <h2>
                Payarr
            </h2>


            <nav>

                <p>
                    <Link to="/">
                        Dashboard
                    </Link>
                </p>


                <p>
                    <Link to="/subscription">
                        Subscription
                    </Link>
                </p>


                <p>
                    <Link to="/payments">
                        Payments
                    </Link>
                </p>


                <p>
                    <Link to="/emby">
                        Emby
                    </Link>
                </p>

            </nav>

        </aside>
    );
}


export default Sidebar;