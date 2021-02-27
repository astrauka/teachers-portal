import { forEach } from 'lodash';
import { AccountStatuses, TeacherWix } from 'public/common/entities/teacher';
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
    const teacher: TeacherWix = $w('#SelectedTeacher').getCurrentItem();
    setImageDefault(teacher.profileImage, $w('#profileImage' as 'Image'), ImageDefault.Profile);
    addSocialIconLinks(teacher);
    addWebsiteLink(teacher);
    addSendEmailButton(teacher);
    addAboutHtml(teacher);
    addTeachingModules(teacher);
    showFilledInformation(teacher);
    showStatus(teacher);
  });
});

function addSocialIconLinks(teacher: TeacherWix) {
  forEach(SOCIAL_ICONS, (url, provider) => {
    const link = teacher[provider];
    const $icon = $w(`#${provider}` as 'Image');
    if (link) {
      $icon.target = '_blank';
      $icon.link = `${url}${link}`;
      $icon.expand();
    }
  });
}

function addWebsiteLink(teacher: TeacherWix) {
  const $website = $w('#website' as 'Text');
  const { website } = teacher;
  if (website) {
    $website.html = `<a href="${website}" target="_blank">${website}</a>`;
    $website.expand();
  }
}

function addSendEmailButton(teacher: TeacherWix) {
  const $button = $w('#curatingTeacherAskButton' as 'Button');
  const { email } = teacher;
  $button.onClick(() => {
    wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
  });
}

function addAboutHtml(teacher: TeacherWix) {
  if (teacher.about) {
    $w('#about' as 'Text').html = teacher.about;
    $w('#aboutGroup' as 'Container').expand();
  }
}

function showFilledInformation(teacher: TeacherWix) {
  if (teacher.countryId) {
    $w('#country' as 'Text').expand();
  }
  if (teacher.city) {
    $w('#city' as 'Text').expand();
  }
  if (teacher.photos?.length) {
    $w('#photosGroup' as 'Container').expand();
  }
  const $menteesDataset = $w('#MenteesDataset');
  $menteesDataset.onReady(() => {
    if ($menteesDataset.getTotalCount()) {
      $w('#menteesGroup' as 'Container').expand();
    }
  });
}

function showStatus(teacher: TeacherWix) {
  if (teacher.statusId?.title === AccountStatuses.Active) {
    $w('#teachersStatusActive' as 'Text').expand();
  } else {
    $w('#teachersStatusInactive' as 'Text').expand();
  }
}

function addTeachingModules(teacher: TeacherWix) {
  $w('#modules' as 'Text').text = teacher.modules ? `Teaching modules: ${teacher.modules}` : '';
}
