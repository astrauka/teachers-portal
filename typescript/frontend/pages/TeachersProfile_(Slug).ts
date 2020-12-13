import { forEach } from 'lodash';
import { TeachersProfile } from 'public/common/entities/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import wixLocation from 'wix-location';

const SOCIAL_ICONS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  linkedIn: 'https://www.linkedin.com/in/',
};

$w.onReady(() =>
  forLoggedInUser(async () => {
    $w('#SelectedTeachersProfile').onReady(() => {
      const teachersProfile: TeachersProfile = $w('#SelectedTeachersProfile').getCurrentItem();
      addSocialIconLinks(teachersProfile, $w);
      addWebsiteLink(teachersProfile, $w);
      addSendEmailButton(teachersProfile, $w);
      hideNotFilledInformation(teachersProfile, $w);
    });
  })
);

function addSocialIconLinks(teachersProfile: TeachersProfile, $w) {
  forEach(SOCIAL_ICONS, (url, provider) => {
    const link = teachersProfile[provider];
    const $icon = $w(`#${provider}` as 'Image');
    if (link) {
      $icon.target = '_blank';
      $icon.link = `${url}${link}`;
    } else {
      $icon.collapse();
    }
  });
}

function addWebsiteLink(teachersProfile: TeachersProfile, $w) {
  const $website = $w('#website' as 'Text');
  const { website } = teachersProfile;
  if (website) {
    $website.html = `<a href="${website}" target="_blank">${website}</a>'`;
  } else {
    $website.collapse();
  }
}

function addSendEmailButton(teachersProfile: TeachersProfile, $w) {
  const $button = $w('#sendEmailButton' as 'Button');
  const { email } = teachersProfile;
  $button.onClick(() => {
    wixLocation.to(`mailto:${email}?subject=MRY%3A%20Question`);
  });
}

function hideNotFilledInformation(teachersProfile: TeachersProfile, $w) {
  if (!teachersProfile.about) {
    $w('#aboutGroup' as 'Group').collapse();
  }

  if (!teachersProfile.photos?.length) {
    $w('#photosGroup' as 'Group').collapse();
  }
}
