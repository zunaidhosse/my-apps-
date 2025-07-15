// This file contains the AppHeader component.

function AppHeader({ title, rightContent, navAction }) {
    return (
        <header className="app-header">
            <div className="header-left">
                {navAction && (
                    <button onClick={navAction.onClick} className="nav-link">
                        {navAction.text}
                    </button>
                )}
            </div>
            <div className="header-center">
                <h1>{title}</h1>
            </div>
            <div className="header-right">
                {rightContent}
            </div>
        </header>
    );
}