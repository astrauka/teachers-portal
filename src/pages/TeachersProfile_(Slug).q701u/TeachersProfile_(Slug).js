import { forEach } from 'lodash';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { ImageDefault, setImageDefault } from 'public/images';
import { addTeacherLoadedHandler } from 'public/teachers';
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
        addTeachingModules(teacher);
        showFilledInformation(teacher);
        showMentees();
    });
});
function addSocialIconLinks(teacher) {
    forEach(SOCIAL_ICONS, (url, provider) => {
        const link = teacher[provider];
        const $icon = $w(`#${provider}`);
        if (link) {
            $icon.target = '_blank';
            $icon.link = `${url}${link}`;
        }
    });
}
function addWebsiteLink(teacher) {
    const $website = $w('#website');
    const { website } = teacher;
    if (website) {
        $website.label = website;
        $website.target = '_blank';
        $website.link = website;
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
        $w('#aboutBox').expand();
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
        $w('#photosBox').expand();
    }
}
function addTeachingModules(teacher) {
    $w('#modules').text = teacher.modules ? `Teaching modules: ${teacher.modules}` : '';
}
function showMentees() {
    const $menteesDataset = $w('#MenteesDataset');
    $menteesDataset.onReady(() => {
        if ($menteesDataset.getTotalCount()) {
            $w('#menteesBox').expand();
        }
    });
    addTeacherLoadedHandler();
}
