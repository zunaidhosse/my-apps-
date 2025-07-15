// This file contains the ApprovalModal component.

const { useState } = React;

function ApprovalModal({ entry, onApprove, onCancel }) {
    const [pin, setPin] = useState('');

    const handleApproveClick = () => {
        const pinRegex = /^\d{4}$/;
        if (pinRegex.test(pin)) {
            onApprove(entry, pin);
        } else {
            alert(invalidPinMessage);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Approve Transaction</h3>
                <div className="entry-item">
                    <div className="entry-item-text">{entry.text}</div>
                    <div className="entry-item-meta transaction-meta">
                        <span>{entry.payment_method} - {entry.amount.toLocaleString()} TK</span>
                    </div>
                </div>
                <input
                    type="tel"
                    maxLength="4"
                    className="modal-input"
                    placeholder={pinInputPlaceholder}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApproveClick();
                        }
                    }}
                    autoFocus
                />
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    <button className="approve-btn" onClick={handleApproveClick}>
                        {approveButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}