import { forLoggedInUser } from 'public/for-logged-in-user';
import {
  resetInputFieldValues,
  setupInputChangeHandlers,
  updateInputValueIfChanged,
} from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import wixLocation from 'wix-location';
import { TeachersProfile } from '../../common/entities/teachers-profile';

const INPUT_FIELDS = {
  '#nameInput': 'fullName',
  '#cityInput': 'city',
  '#levelDropdown': 'level',
};

$w.onReady(() =>
  forLoggedInUser(async () => {
    const teachersLevelsPromise = getTeacherLevels($w);
    updateInputValueIfChanged(INPUT_FIELDS, $w);
    setupInputChangeHandlers(INPUT_FIELDS, $w);
    $w('#resetFiltersButton' as 'Button').onClick(async () => {
      resetInputFieldValues(INPUT_FIELDS);
    });

    wixLocation.onChange(async () => {
      updateInputValueIfChanged(INPUT_FIELDS, $w);
      await updateTeachersFilter($w, teachersLevelsPromise);
    });
    await updateTeachersFilter($w, teachersLevelsPromise);
  })
);

export function teachersName_click(event) {
  const $teacher = $w.at(event.context);
  const { slug } = $teacher('#TeachersProfileDataset').getCurrentItem() as TeachersProfile;
  wixLocation.to(`/teacher/${slug}`);
}

async function getTeacherLevels($w) {
  return new Promise((resolve) => {
    $w('#TeacherLevelsDataset').onReady(async () => {
      resolve($w('#TeacherLevelsDataset').loadPage(1));
    });
  });
}

async function updateTeachersFilter($w, teachersLevelsPromise) {
  const values = wixLocation.query;
  const teachersLevels = await teachersLevelsPromise;
  const teachersLevel = teachersLevels.find(({ title }) => title === values.level);
  const levelId = teachersLevel && teachersLevel._id;
  const datasetFilter = getFilter([
    [values.fullName, (filter) => filter.contains('fullName', values.fullName)],
    [values.city, (filter) => filter.contains('city', values.city)],
    [levelId, (filter) => filter.eq('levelId', levelId)],
  ]);

  await $w('#TeachersProfileDataset').setFilter(datasetFilter);

  const $teachersRepeater = $w('#teachersRepeater' as 'Repeater');
  const $loadMoreButton = $w('#loadMoreButton' as 'Button');
  const $teachersEmptyState = $w('#teachersEmptyState' as 'Container');
  const $TeachersProfileDataset = $w('#TeachersProfileDataset');

  $TeachersProfileDataset.onReady(() => {
    if ($TeachersProfileDataset.getCurrentItem()) {
      $teachersRepeater.expand();
      $loadMoreButton.expand();
      $teachersEmptyState.collapse();
    } else {
      $teachersRepeater.collapse();
      $loadMoreButton.collapse();
      $teachersEmptyState.expand();
    }
  });
}
