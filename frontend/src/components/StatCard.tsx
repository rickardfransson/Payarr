interface StatCardProps {
    title: string;
    value: string;
    description?: string;
}


function StatCard({
    title,
    value,
    description
}: StatCardProps) {

    return (
        <div
            style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff"
            }}
        >

            <h3>
                {title}
            </h3>


            <h2>
                {value}
            </h2>


            {description && (
                <p>
                    {description}
                </p>
            )}

        </div>
    );
}


export default StatCard;