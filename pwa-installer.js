let deferredPrompt;
const installContainer = document.createElement('div');
installContainer.id = 'install-container';
document.body.appendChild(installContainer);

const installButtonText = "Add to Home Screen";

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can install the PWA
    showInstallPromotion();
});

function showInstallPromotion() {
    installContainer.innerHTML = `<button id="install-btn">${installButtonText}</button>`;
    installContainer.style.display = 'flex';
    
    const installButton = document.getElementById('install-btn');

    installButton.addEventListener('click', async () => {
        // Hide the app provided install promotion
        installContainer.style.display = 'none';
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    // Hide the install promotion
    installContainer.style.display = 'none';
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    console.log('PWA was installed');
});

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}