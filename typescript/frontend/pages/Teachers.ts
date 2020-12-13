import { AccountStatus, AccountStatuses, TeacherLevel } from 'public/common/entities/teachers-info';
import { TeachersProfile } from 'public/common/entities/teachers-profile';
import { forLoggedInUser } from 'public/for-logged-in-user';
import {
  resetInputFieldValues,
  setupInputChangeHandlers,
  updateInputValueIfChanged,
} from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';

const INPUT_FIELDS = {
  '#nameInput': 'fullName',
  '#cityInput': 'city',
  '#levelDropdown': 'level',
};

let state: {
  teachersLevelsPromise: Promise<TeacherLevel[]>;
  accountStatusPromise: Promise<AccountStatus[]>;
};

$w.onReady(() =>
  forLoggedInUser(async () => {
    state = {
      teachersLevelsPromise: loadFirstDatasetPage<TeacherLevel>($w('#TeacherLevelsDataset')),
      accountStatusPromise: loadFirstDatasetPage<AccountStatus>($w('#AccountStatusesDataset')),
    };
    updateInputValueIfChanged(INPUT_FIELDS, $w);
    setupInputChangeHandlers(INPUT_FIELDS, $w);
    $w('#resetFiltersButton' as 'Button').onClick(async () => {
      resetInputFieldValues(INPUT_FIELDS);
    });

    wixLocation.onChange(async () => {
      updateInputValueIfChanged(INPUT_FIELDS, $w);
      await updateTeachersFilter($w);
    });
    await updateTeachersFilter($w);
  })
);

export function teachersName_click(event) {
  const $teacher = $w.at(event.context);
  const { slug } = $teacher('#TeachersProfileDataset').getCurrentItem() as TeachersProfile;
  wixLocation.to(`/teacher/${slug}`);
}

async function updateTeachersFilter($w) {
  const values = wixLocation.query;
  const levelId =
    values.level &&
    (await state.teachersLevelsPromise).find(({ title }) => title === values.level)?._id;
  const statusId = (await state.accountStatusPromise).find(
    ({ title }) => title === AccountStatuses.NotATeacher
  )?._id;

  const datasetFilter = getFilter([
    [values.fullName, (filter) => filter.contains('fullName', values.fullName)],
    [values.city, (filter) => filter.contains('city', values.city)],
    [levelId, (filter) => filter.eq('levelId', levelId)],
    [statusId, (filter) => filter.ne('statusId', statusId)],
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
