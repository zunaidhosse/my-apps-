// This file contains tweakable constants and configuration for the application.

/* @tweakable The main theme color for the app header */
const headerColor = "#075E54";
document.documentElement.style.setProperty('--primary-color', headerColor);
/* @tweakable The color for text in the header */
const headerTextColor = "#FFFFFF";
document.documentElement.style.setProperty('--light-text-color', headerTextColor);

const loginTitle = "Welcome to Payment Tracker";
const loginSubtitle = "Sign in to continue";
const loginButtonText = "Sign in with Google";

/* @tweakable Confirmation message for the 'All Delete' command. */
const allDeleteConfirmationMessage = "Are you sure you want to delete ALL of your entries? This is permanent.";
const closeChatMessage = "🕓 Today's chat has been cleared. Data saved in history.";
/* @tweakable A confirmation message before deleting a transaction */
const deleteConfirmationMessage = "Are you sure you want to delete this transaction? This action cannot be undone.";
const deleteSuccessMessage = "❌ Entry deleted successfully.";
const deleteWrongPasswordMessage = "❗Wrong password. Cannot delete entry.";
/* @tweakable Message for invalid PIN entry */
const invalidPinMessage = "Please enter a valid 4-digit PIN";
/* @tweakable Placeholder for PIN input */
const pinInputPlaceholder = "Enter 4-digit PIN to approve";
/* @tweakable Text for the approve button */
const approveButtonText = "Approve";
/* @tweakable Font color for the displayed approval PIN */
const pinDisplayColor = "#34A853";
/* @tweakable Font size for the displayed approval PIN */
const pinDisplayFontSize = "0.8rem";

const avatarSize = 32;
const usernameColor = "#075E54";
const timestampColor = "rgba(0, 0, 0, 0.4)";

const transactionRegex = /^(01\d{9})[/\s,]+(\d+)/;