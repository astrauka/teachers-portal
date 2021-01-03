import { loginWithGoogle } from 'backend/backend-api';
import wixUsers from 'wix-users';
$w.onReady(function () {
    const $googleLoginIframe = $w('#googleLoginIframe');
    const $acceptTerms = $w('#checkbox1');
    $acceptTerms.onClick(() => {
        if ($acceptTerms.checked) {
            $googleLoginIframe.show();
        }
        else {
            $googleLoginIframe.hide();
        }
    });
    $googleLoginIframe.onMessage(async (message) => {
        const { idToken, email } = message.data;
        console.info('Logging in with Google', email);
        const $loginStatus = $w('#loginStatus');
        $loginStatus.text = 'Authenticating, please wait...';
        try {
            const sessionToken = await loginWithGoogle(idToken);
            console.info('Login succeeded for', email);
            $loginStatus.text = 'Authenticated, redirecting...';
            await wixUsers.applySessionToken(sessionToken);
        }
        catch (e) {
            console.error('Login failed', email, e);
            $loginStatus.text = 'Could not authenticate you.\nPlease contact system administrators.';
        }
    });
});
