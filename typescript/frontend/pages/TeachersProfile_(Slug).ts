import { forEach } from 'lodash';
import { TeacherWix } from 'public/common/entities/teacher';
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
    const teacher: TeacherWix = $w('#SelectedTeacher').getCurrentItem();
    setImageDefault(teacher.profileImage, $w('#profileImage' as 'Image'), ImageDefault.Profile);
    addSocialIconLinks(teacher);
    addSendEmailButton(teacher);
    addAboutHtml(teacher);
    showFilledInformation(teacher);
    showTeacherModules();
    showMentees();
  });
});

function addSocialIconLinks(teacher: TeacherWix) {
  forEach(SOCIAL_ICONS, (url, provider) => {
    const link = teacher[provider];
    const $icon = $w(`#${provider}` as 'Image');
    if (link) {
      $icon.target = '_blank';
      $icon.link = `${url}${link}`;
    }
    showEnabledElement($icon, $w(`#${provider}Disabled` as 'Image'), link);
  });
}

function addSendEmailButton(teacher: TeacherWix) {
  const $button = $w('#curatingTeacherAskButton' as 'Button');
  const { email } = teacher;
  $button.onClick(() => {
    wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
  });
}

function addAboutHtml(teacher: TeacherWix) {
  const $aboutBox = $w('#aboutBox' as 'Box');
  $w('#about' as 'Text').html = teacher.about;
  expandIfHasData($aboutBox, teacher.about);
}

function showFilledInformation(teacher: TeacherWix) {
  expandIfHasData($w('#country' as 'Text'), teacher.countryId);
  expandIfHasData($w('#city' as 'Text'), teacher.city);
  expandIfHasData($w('#photosBox' as 'Box'), teacher.photos?.length);
}

function showMentees() {
  const $menteesDataset = $w('#MenteesDataset');
  $menteesDataset.onReady(() => {
    const menteesCount = $menteesDataset.getTotalCount();
    expandIfHasData($w('#menteesBox' as 'Box'), menteesCount);
    if (menteesCount) {
      addTeacherLoadedHandler();
    }
  });
}

function showTeacherModules() {
  const $teacherModulesDataset = $w('#TeacherModulesDataset');
  $teacherModulesDataset.onReady(() => {
    expandIfHasData($w('#teachingModules' as 'Table'), $teacherModulesDataset.getTotalCount());
  });
}
