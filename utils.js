// This file contains utility functions and custom hooks for the application.

const { useState, useEffect, useMemo, useCallback } = React;

// --- Navigation Hook ---
function useSimpleRouter() {
    const [path, setPath] = useState(window.location.pathname + window.location.search);

    const handlePopState = useCallback(() => {
        setPath(window.location.pathname + window.location.search);
    }, []);

    useEffect(() => {
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    const navigate = useCallback((to, options = { replace: false }) => {
        if (options.replace) {
            window.history.replaceState(null, '', to);
        } else {
            window.history.pushState(null, '', to);
        }
        handlePopState();
    }, [handlePopState]);
    
    const urlParams = useMemo(() => new URLSearchParams(window.location.search), [path]);

    return { navigate, urlParams };
}

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().slice(0, 10);

// Helper to format timestamp
const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};