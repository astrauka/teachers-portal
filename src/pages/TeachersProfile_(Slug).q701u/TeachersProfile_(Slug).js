import { forEach } from 'lodash';
import { forLoggedInUser } from 'public/for-logged-in-user';
import wixLocation from 'wix-location';
const SOCIAL_ICONS = {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    linkedIn: 'https://www.linkedin.com/in/',
};
$w.onReady(() => forLoggedInUser(async () => {
    $w('#SelectedTeachersProfile').onReady(() => {
        const teachersProfile = $w('#SelectedTeachersProfile').getCurrentItem();
        addSocialIconLinks(teachersProfile, $w);
        addWebsiteLink(teachersProfile, $w);
        addSendEmailButton(teachersProfile, $w);
        addAboutHtml(teachersProfile, $w);
        hideNotFilledInformation(teachersProfile, $w);
    });
}));
function addSocialIconLinks(teachersProfile, $w) {
    forEach(SOCIAL_ICONS, (url, provider) => {
        const link = teachersProfile[provider];
        const $icon = $w(`#${provider}`);
        if (link) {
            $icon.target = '_blank';
            $icon.link = `${url}${link}`;
        }
        else {
            $icon.collapse();
        }
    });
}
function addWebsiteLink(teachersProfile, $w) {
    const $website = $w('#website');
    const { website } = teachersProfile;
    if (website) {
        $website.html = `<a href="${website}" target="_blank">${website}</a>`;
    }
    else {
        $website.collapse();
    }
}
function addSendEmailButton(teachersProfile, $w) {
    const $button = $w('#sendEmailButton');
    const { email } = teachersProfile;
    $button.onClick(() => {
        wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
    });
}
function addAboutHtml(teachersProfile, $w) {
    $w('#about').html = teachersProfile.about;
}
function hideNotFilledInformation(teachersProfile, $w) {
    var _a;
    if (!teachersProfile.about) {
        $w('#aboutGroup').collapse();
    }
    if (!((_a = teachersProfile.photos) === null || _a === void 0 ? void 0 : _a.length)) {
        $w('#photosGroup').collapse();
    }
}
