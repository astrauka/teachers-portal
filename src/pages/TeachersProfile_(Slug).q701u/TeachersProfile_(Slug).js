import { forEach } from 'lodash';
import { forCurrentTeacher } from 'public/for-current-teacher';
import wixLocation from 'wix-location';
const SOCIAL_ICONS = {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    linkedIn: 'https://www.linkedin.com/in/',
};
forCurrentTeacher(async () => {
    $w('#SelectedTeacher').onReady(() => {
        const teacher = $w('#SelectedTeacher').getCurrentItem();
        addSocialIconLinks(teacher, $w);
        addWebsiteLink(teacher, $w);
        addSendEmailButton(teacher, $w);
        addAboutHtml(teacher, $w);
        hideNotFilledInformation(teacher, $w);
    });
});
function addSocialIconLinks(teacher, $w) {
    forEach(SOCIAL_ICONS, (url, provider) => {
        const link = teacher[provider];
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
function addWebsiteLink(teacher, $w) {
    const $website = $w('#website');
    const { website } = teacher;
    if (website) {
        $website.html = `<a href="${website}" target="_blank">${website}</a>`;
    }
    else {
        $website.collapse();
    }
}
function addSendEmailButton(teacher, $w) {
    const $button = $w('#sendEmailButton');
    const { email } = teacher;
    $button.onClick(() => {
        wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
    });
}
function addAboutHtml(teacher, $w) {
    if (teacher.about) {
        $w('#about').html = teacher.about;
    }
}
function hideNotFilledInformation(teacher, $w) {
    var _a;
    if (!teacher.about) {
        $w('#aboutGroup').collapse();
    }
    if (!((_a = teacher.photos) === null || _a === void 0 ? void 0 : _a.length)) {
        $w('#photosGroup').collapse();
    }
}
