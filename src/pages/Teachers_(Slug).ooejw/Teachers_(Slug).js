import { forEach } from 'lodash';
import { AccountStatuses, AccountStatusIds } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { ImageDefault, setImageDefault } from 'public/images';
import wixLocation from 'wix-location';
const SOCIAL_ICONS = {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    linkedIn: 'https://www.linkedin.com/in/',
};
forCurrentTeacher('teachersProfile', async () => {
    $w('#SelectedTeacher').onReady(() => {
        const teacher = $w('#SelectedTeacher').getCurrentItem();
        setImageDefault(teacher.profileImage, $w('#profileImage'), ImageDefault.Profile);
        addSocialIconLinks(teacher);
        addWebsiteLink(teacher);
        addSendEmailButton(teacher);
        addAboutHtml(teacher);
        showFilledInformation(teacher);
        showStatus(teacher);
    });
});
function addSocialIconLinks(teacher) {
    forEach(SOCIAL_ICONS, (url, provider) => {
        const link = teacher[provider];
        const $icon = $w(`#${provider}`);
        if (link) {
            $icon.target = '_blank';
            $icon.link = `${url}${link}`;
            $icon.expand();
        }
    });
}
function addWebsiteLink(teacher) {
    const $website = $w('#website');
    const { website } = teacher;
    if (website) {
        $website.html = `<a href="${website}" target="_blank">${website}</a>`;
        $website.expand();
    }
}
function addSendEmailButton(teacher) {
    const $button = $w('#curatingTeacherAskButton');
    const { email } = teacher;
    $button.onClick(() => {
        wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
    });
}
function addAboutHtml(teacher) {
    if (teacher.about) {
        $w('#about').html = teacher.about;
        $w('#aboutGroup').expand();
    }
}
function showFilledInformation(teacher) {
    var _a;
    if (teacher.countryId) {
        $w('#country').expand();
    }
    if (teacher.city) {
        $w('#city').expand();
    }
    if ((_a = teacher.photos) === null || _a === void 0 ? void 0 : _a.length) {
        $w('#photosGroup').expand();
    }
    const $menteesDataset = $w('#MenteesDataset');
    $menteesDataset.onReady(() => {
        if ($menteesDataset.getTotalCount()) {
            $w('#menteesGroup').expand();
        }
    });
}
function showStatus(teacher) {
    var _a;
    if (teacher.statusId === AccountStatusIds.Active ||
        ((_a = teacher.statusId) === null || _a === void 0 ? void 0 : _a.title) === AccountStatuses.Active) {
        $w('#teachersStatusActive').expand();
    }
    else {
        $w('#teachersStatusInactive').expand();
    }
}
