// This file contains the EntryItem component.

const { useState, useEffect, useMemo, useSyncExternalStore } = React;

function EntryItem({ entry, currentUser, onDelete, onApprove }) {
    const isTransaction = entry.type === 'transaction';
    const isSystemMessage = entry.type === 'system';
    const isOwnEntry = currentUser && entry.username === currentUser.username;
    const isPending = isTransaction && entry.status === 'pending';
    const isApprovedWithPin = isTransaction && entry.status === 'approved' && entry.pin;

    if (isSystemMessage) {
        return (
            <div className="entry-wrapper justify-center">
                <div className="entry-item system-message">
                    <div className="entry-item-text">{entry.text}</div>
                </div>
            </div>
        );
    }
    
    const bubbleAlignment = isOwnEntry ? 'align-right' : 'align-left';
    
    const handleEntryClick = () => {
        if(isPending && isOwnEntry) {
            onApprove(entry);
        }
    }

    return (
        <div className={`entry-wrapper ${bubbleAlignment} ${isOwnEntry ? 'is-own' : ''}`}>
             {!isOwnEntry && (
                <img src={`https://images.websim.com/avatar/${entry.username}`} alt={entry.username} className="avatar" />
             )}
            <div className={`entry-item ${isPending ? 'pending' : ''}`} onClick={handleEntryClick}>
                {isTransaction && isOwnEntry && !isPending && (
                    <button onClick={(e) => { e.stopPropagation(); onDelete(entry); }} className="delete-entry-btn" title="Delete entry">
                        🗑️
                    </button>
                )}
                {!isOwnEntry && <div className="entry-username">{entry.username}</div>}
                {isPending && <div className="pending-tag">Pending Approval</div>}
                <div className="entry-item-text">
                    {entry.text}
                </div>
                {isApprovedWithPin && (
                    <div className="entry-pin-display">PIN: {entry.pin}</div>
                )}
                {isTransaction ? (
                    <div className="entry-item-meta transaction-meta">
                        <span>{entry.payment_method} - {entry.amount.toLocaleString()} TK</span>
                        <span className="entry-timestamp">{formatTime(entry.created_at)}</span>
                    </div>
                ) : (
                     <div className="entry-item-meta">
                        <span className="entry-timestamp">{formatTime(entry.created_at)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}