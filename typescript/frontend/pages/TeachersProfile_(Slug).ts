import { forEach } from 'lodash';
import { Teacher } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import wixLocation from 'wix-location';

const SOCIAL_ICONS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  linkedIn: 'https://www.linkedin.com/in/',
};

forCurrentTeacher(async () => {
  $w('#SelectedTeacher').onReady(() => {
    const teacher: Teacher = $w('#SelectedTeacher').getCurrentItem();
    addSocialIconLinks(teacher, $w);
    addWebsiteLink(teacher, $w);
    addSendEmailButton(teacher, $w);
    addAboutHtml(teacher, $w);
    hideNotFilledInformation(teacher, $w);
  });
});

function addSocialIconLinks(teacher: Teacher, $w) {
  forEach(SOCIAL_ICONS, (url, provider) => {
    const link = teacher[provider];
    const $icon = $w(`#${provider}` as 'Image');
    if (link) {
      $icon.target = '_blank';
      $icon.link = `${url}${link}`;
    } else {
      $icon.collapse();
    }
  });
}

function addWebsiteLink(teacher: Teacher, $w) {
  const $website = $w('#website' as 'Text');
  const { website } = teacher;
  if (website) {
    $website.html = `<a href="${website}" target="_blank">${website}</a>`;
  } else {
    $website.collapse();
  }
}

function addSendEmailButton(teacher: Teacher, $w) {
  const $button = $w('#sendEmailButton' as 'Button');
  const { email } = teacher;
  $button.onClick(() => {
    wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
  });
}

function addAboutHtml(teacher: Teacher, $w) {
  if (teacher.about) {
    $w('#about' as 'Text').html = teacher.about;
  }
}

function hideNotFilledInformation(teacher: Teacher, $w) {
  if (!teacher.about) {
    $w('#aboutGroup' as 'Group').collapse();
  }

  if (!teacher.photos?.length) {
    $w('#photosGroup' as 'Group').collapse();
  }
}
