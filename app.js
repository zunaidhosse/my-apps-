// This file contains the main App component and renders the application to the DOM.

const { useMemo, useState, useEffect } = React;

function App() {
    const { navigate, urlParams } = useSimpleRouter();

    const view = urlParams.get('view');
    const date = urlParams.get('date');

    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        // A simple check for a user object can represent login state.
        // In a real app, this would be more robust.
        window.websim.getCurrentUser().then(user => {
            if (user && user.id) {
                setCurrentUser(user);
            }
        });
    }, []);

    if (!currentUser) {
        return <LoginScreen onLogin={() => window.websim.auth.signInWithGoogle()} />;
    }

    if (view === 'history' && date) {
        return <HistoryDetailPage date={date} navigate={navigate} />;
    }
    if (view === 'history') {
        return <HistoryListPage navigate={navigate} />;
    }
    return <HomePage navigate={navigate} currentUser={currentUser} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);