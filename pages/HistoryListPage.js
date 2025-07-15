// This file contains the HistoryListPage component.

const { useMemo, useSyncExternalStore } = React;

function HistoryListPage({ navigate }) {
    const allTransactions = useSyncExternalStore(
        (callback) => room.collection('transactions_v2').subscribe(callback),
        () => room.collection('transactions_v2').getList()
    ) || [];

    const dates = useMemo(() => {
        const dateSet = new Set(allTransactions.map(t => t.date));
        return Array.from(dateSet).sort().reverse();
    }, [allTransactions]);

    return (
        <>
            <AppHeader title="History" navAction={{onClick: () => navigate("/"), text: "Home"}} />
            <div className="main-content history-content">
                <ul className="history-list">
                    {dates.map(date => (
                        <li key={date} className="history-list-item">
                            <a href={`?view=history&date=${date}`} onClick={(e) => { e.preventDefault(); navigate(`?view=history&date=${date}`) }}>
                                {new Date(date).toDateString()}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}