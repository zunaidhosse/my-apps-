// This file contains the HistoryDetailPage component.

const { useMemo, useSyncExternalStore } = React;

function HistoryDetailPage({ date, navigate }) {
    const transactionsFilter = useMemo(() => ({ date }), [date]);
    const transactions = useSyncExternalStore(
        (callback) => room.collection('transactions_v2').filter(transactionsFilter).subscribe(callback),
        () => room.collection('transactions_v2').filter(transactionsFilter).getList()
    ) || [];

    const totalAmount = useMemo(() => {
        // Only sum approved transactions for the total
        return transactions
            .filter(entry => entry.status === 'approved')
            .reduce((sum, entry) => sum + (entry.amount || 0), 0);
    }, [transactions]);
    
    const transactionsForInvoice = useMemo(() => {
        // Only include approved transactions in the invoice
        return transactions.filter(t => t.type === 'transaction' && t.status === 'approved');
    }, [transactions]);

    const sortedTransactions = useMemo(() => [...transactionsForInvoice].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)), [transactionsForInvoice]);

    const handleDownload = () => {
        const element = document.getElementById('invoice-to-print');
        const opt = {
          margin:       0.5,
          filename:     `invoice_${date}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <>
            <AppHeader 
                title="Invoice" 
                rightContent={<div className="header-date">{new Date(date).toDateString()}</div>} 
                navAction={{onClick: () => navigate("?view=history"), text: "Back"}} 
            />
            <div className="main-content history-content">
                <div className="invoice-container">
                    <div id="invoice-to-print">
                        <table id="invoice-table">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Phone</th>
                                    <th>TK</th>
                                    <th>Bkash</th>
                                    <th>Nagad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTransactions.map((entry, index) => (
                                    <tr key={entry.id}>
                                        <td>{index + 1}</td>
                                        <td>{entry.phone}</td>
                                        <td>{entry.amount > 0 ? entry.amount.toLocaleString() : `(${Math.abs(entry.amount).toLocaleString()})`}</td>
                                        <td>{entry.payment_method === 'Bkash' ? '✓' : ''}</td>
                                        <td>{entry.payment_method === 'Nagad' ? '✓' : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="invoice-total">Total TK: {totalAmount.toLocaleString()}</div>
                    </div>
                    <button onClick={handleDownload} className="download-btn">Download Invoice</button>
                </div>
            </div>
        </>
    );
}