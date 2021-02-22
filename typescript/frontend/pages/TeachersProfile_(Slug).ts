import { forEach } from 'lodash';
import { Teacher } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import wixLocation from 'wix-location';

const SOCIAL_ICONS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  linkedIn: 'https://www.linkedin.com/in/',
};

forCurrentTeacher('teachersProfile', async () => {
  $w('#SelectedTeacher').onReady(() => {
    const teacher: Teacher = $w('#SelectedTeacher').getCurrentItem();
    addSocialIconLinks(teacher);
    addWebsiteLink(teacher);
    addSendEmailButton(teacher);
    addAboutHtml(teacher);
    showFilledInformation(teacher);
    makeTeachersNameClickable();
  });
});

function addSocialIconLinks(teacher: Teacher) {
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

function addWebsiteLink(teacher: Teacher) {
  const $website = $w('#website' as 'Text');
  const { website } = teacher;
  if (website) {
    $website.html = `<a href="${website}" target="_blank">${website}</a>`;
    $website.expand();
  }
}

function addSendEmailButton(teacher: Teacher) {
  const $button = $w('#sendEmailButton' as 'Button');
  const { email } = teacher;
  $button.onClick(() => {
    wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
  });
}

function addAboutHtml(teacher: Teacher) {
  if (teacher.about) {
    $w('#about' as 'Text').html = teacher.about;
    $w('#aboutGroup' as 'Container').expand();
  }
}

function showFilledInformation(teacher: Teacher) {
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

function makeTeachersNameClickable() {
  $w('#teachersRepeater' as 'Repeater').onItemReady(($item, teacher: Teacher) => {
    $item('#teachersName' as 'Text').onClick(() => wixLocation.to(`/teacher/${teacher.slug}`));
  });
}
