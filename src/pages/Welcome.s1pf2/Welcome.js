import wixUsers from 'wix-users';
import wixWindow from 'wix-window';
$w.onReady(function () {
    wixWindow.openLightbox('Sign in');
    if (!wixUsers.currentUser.loggedIn) {
        $w('#loginButton').show();
    }
});
