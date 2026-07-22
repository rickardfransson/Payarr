import "../styles/cards.css";


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
        <div className="stat-card">

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