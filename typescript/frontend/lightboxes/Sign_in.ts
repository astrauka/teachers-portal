import { loginWithGoogle } from 'backend/backend-api';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(function () {
  const $googleLoginIframe = $w('#googleLoginIframe' as 'HtmlComponent');

  const $acceptTerms = $w('#checkbox1' as 'Checkbox');
  $acceptTerms.onClick(() => {
    if ($acceptTerms.checked) {
      $googleLoginIframe.show();
    } else {
      $googleLoginIframe.hide();
    }
  });

  $googleLoginIframe.onMessage(async (message) => {
    const { idToken, email } = message.data;
    console.info('Logging in with Google', email);
    const $loginStatus = $w('#loginStatus' as 'Text');
    $loginStatus.text = 'Authenticating, please wait...';

    try {
      const { sessionToken, redirectPath } = await loginWithGoogle(idToken);
      console.info('Login succeeded for', email);
      $loginStatus.text = 'Authenticated, redirecting...';
      await wixUsers.applySessionToken(sessionToken);
      wixLocation.to(redirectPath);
    } catch (e) {
      console.error('Login failed', email, e);
      $loginStatus.text = 'Could not authenticate you.\nPlease contact system administrators.';
    }
  });
});
