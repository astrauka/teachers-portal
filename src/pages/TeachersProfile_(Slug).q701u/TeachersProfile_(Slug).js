import { forEach } from 'lodash';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { ImageDefault, setImageDefault } from 'public/images';
import { addTeacherLoadedHandler } from 'public/teachers';
import { expandIfHasData, showEnabledElement } from 'public/wix-utils';
import wixLocation from 'wix-location';
const SOCIAL_ICONS = {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    linkedIn: 'https://www.linkedin.com/in/',
    website: '',
};
forCurrentTeacher('teachersProfile', async () => {
    $w('#SelectedTeacher').onReady(() => {
        const teacher = $w('#SelectedTeacher').getCurrentItem();
        setImageDefault(teacher.profileImage, $w('#profileImage'), ImageDefault.Profile);
        addSocialIconLinks(teacher);
        addSendEmailButton(teacher);
        addAboutHtml(teacher);
        showFilledInformation(teacher);
        showTeacherModules();
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
        showEnabledElement($icon, $w(`#${provider}Disabled`), link);
    });
}
function addSendEmailButton(teacher) {
    const $button = $w('#curatingTeacherAskButton');
    const { email } = teacher;
    $button.onClick(() => {
        wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
    });
}
function addAboutHtml(teacher) {
    const $aboutBox = $w('#aboutBox');
    $w('#about').html = teacher.about;
    expandIfHasData($aboutBox, teacher.about);
}
function showFilledInformation(teacher) {
    var _a;
    expandIfHasData($w('#country'), teacher.countryId);
    expandIfHasData($w('#city'), teacher.city);
    expandIfHasData($w('#photosBox'), (_a = teacher.photos) === null || _a === void 0 ? void 0 : _a.length);
}
function showMentees() {
    const $menteesDataset = $w('#MenteesDataset');
    $menteesDataset.onReady(() => {
        const menteesCount = $menteesDataset.getTotalCount();
        expandIfHasData($w('#menteesBox'), menteesCount);
        if (menteesCount) {
            addTeacherLoadedHandler();
        }
    });
}
function showTeacherModules() {
    const $teacherModulesDataset = $w('#TeacherModulesDataset');
    $teacherModulesDataset.onReady(() => {
        expandIfHasData($w('#teachingModulesBox'), $teacherModulesDataset.getTotalCount());
    });
}
