// This file contains the HomePage component.

const { useState, useEffect, useMemo, useSyncExternalStore } = React;

function HomePage({ navigate, currentUser }) {
    const today = getTodayDateString();
    const [inputValue, setInputValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bkash');
    const [messageMode, setMessageMode] = useState('transaction'); // 'transaction' or 'normal'
    const [approvingEntry, setApprovingEntry] = useState(null);

    // Separate collections for transactions and normal messages
    const transactionsFilter = useMemo(() => ({ date: today }), [today]);
    const transactions = useSyncExternalStore(
        (callback) => room.collection('transactions_v2').filter(transactionsFilter).subscribe(callback),
        () => room.collection('transactions_v2').filter(transactionsFilter).getList()
    ) || [];
    
    const messagesFilter = useMemo(() => ({ date: today }), [today]);
    const messages = useSyncExternalStore(
        (callback) => room.collection('messages_v1').filter(messagesFilter).subscribe(callback),
        () => room.collection('messages_v1').filter(messagesFilter).getList()
    ) || [];

    const combinedEntries = useMemo(() => {
        return [...transactions, ...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [transactions, messages]);

    const totalAmount = useMemo(() => {
        return transactions
            .filter(entry => entry.status === 'approved')
            .reduce((sum, entry) => sum + (entry.amount || 0), 0);
    }, [transactions]);

    const handleDeleteTransaction = async (entry) => {
        if (window.confirm(deleteConfirmationMessage)) {
            // Delete the transaction record
            await room.collection('transactions_v2').delete(entry.id);
            // Create a system message to confirm deletion
            await room.collection('messages_v1').create({
                date: today,
                type: 'system',
                text: deleteSuccessMessage,
            });
        }
    };

    const handleStartApproval = (entry) => {
        setApprovingEntry(entry);
    };

    const handleConfirmApproval = async (entryToApprove, pin) => {
         await room.collection('transactions_v2').update(entryToApprove.id, {
            status: 'approved',
            pin: pin
        });
        setApprovingEntry(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text) return;

        if (messageMode === 'normal') {
            await room.collection('messages_v1').create({
                date: today,
                type: 'message',
                text,
            });
            setInputValue('');
            return;
        }

        // --- Transaction Mode Logic ---
        
        // Special command: All Delete
        if (text.toLowerCase() === 'all delete') {
            if (window.confirm(allDeleteConfirmationMessage)) {
                const allTransactions = room.collection('transactions_v2').getList();
                const allMessages = room.collection('messages_v1').getList();
                
                const deletePromises = [];
                for (const item of [...allTransactions, ...allMessages]) {
                    if(item.username === currentUser.username) {
                         if (item.type === 'transaction') {
                            deletePromises.push(room.collection('transactions_v2').delete(item.id));
                         } else {
                            deletePromises.push(room.collection('messages_v1').delete(item.id));
                         }
                    }
                }
                await Promise.all(deletePromises);
            }
            setInputValue('');
            return;
        }
        
        // Special command: close
        if (text.toLowerCase() === 'close') {
             await room.collection('messages_v1').create({
                date: today,
                type: 'system',
                text: closeChatMessage,
            });
            setInputValue('');
            return;
        }

        // Check for transaction
        const match = text.match(transactionRegex);
        if (match) {
            const phone = match[1];
            const amount = parseInt(match[2], 10);
            await room.collection('transactions_v2').create({
                date: today,
                type: 'transaction',
                text,
                phone,
                amount,
                payment_method: paymentMethod,
                status: 'pending', // New transactions are pending
            });
            setInputValue('');
            return;
        }
        
        // If it's not a special command or transaction, treat as a normal message even in transaction mode.
         await room.collection('messages_v1').create({
            date: today,
            type: 'message',
            text,
        });
        setInputValue('');
    };
    
    return (
        <>
            <AppHeader 
                title="Payment Tracker" 
                rightContent={<div className="total-amount">Total: {totalAmount.toLocaleString()} TK</div>} 
                navAction={{onClick: () => navigate("?view=history"), text: "History"}} 
            />
            <div className="main-content">
                <div className="entry-list">
                    {combinedEntries.map(entry => (
                        <EntryItem 
                            key={entry.id}
                            entry={entry}
                            currentUser={currentUser}
                            onDelete={handleDeleteTransaction}
                            onApprove={handleStartApproval}
                        />
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                 <div className="message-mode-selector">
                    <label>
                        <input type="radio" name="messageMode" value="transaction" checked={messageMode === 'transaction'} onChange={(e) => setMessageMode(e.target.value)} />
                        Transaction Entry
                    </label>
                    <label>
                        <input type="radio" name="messageMode" value="normal" checked={messageMode === 'normal'} onChange={(e) => setMessageMode(e.target.value)} />
                        Normal Message
                    </label>
                </div>
                {messageMode === 'transaction' && (
                    <div className="payment-method-selector">
                        <label>
                            <input type="radio" name="paymentMethod" value="Bkash" checked={paymentMethod === 'Bkash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            Bkash
                        </label>
                        <label>
                            <input type="radio" name="paymentMethod" value="Nagad" checked={paymentMethod === 'Nagad'} onChange={(e) => setPaymentMethod(e.target.value)} />
                            Nagad
                        </label>
                    </div>
                )}
                <div className="input-area">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={messageMode === 'transaction' ? 'Type transaction, command, or message...' : 'Type a message...'}
                        rows="1"
                         onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    ></textarea>
                    <button type="submit">➤</button>
                </div>
            </form>
            {approvingEntry && (
                <ApprovalModal
                    entry={approvingEntry}
                    onApprove={handleConfirmApproval}
                    onCancel={() => setApprovingEntry(null)}
                />
            )}
        </>
    );
}