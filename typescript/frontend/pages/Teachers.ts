import {
  AccountStatus,
  AccountStatuses,
  Teacher,
  TeacherLevel,
} from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { resetInputFieldValues, updateInputValueIfChanged } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';

type TeachersFilter = {
  fullName: string;
  city: string;
  level: string;
};
type TeachersFilterKey = keyof TeachersFilter;

const TEXT_INPUTS: TeachersFilterKey[] = ['fullName', 'city'];
const DROPDOWNS: TeachersFilterKey[] = ['level'];

let state: {
  fieldValues: TeachersFilter;
  teacherLevels: TeacherLevel[];
  accountStatuses: AccountStatus[];
};

forCurrentTeacher(async () => {
  const [teacherLevels, accountStatuses] = await Promise.all([
    loadFirstDatasetPage<TeacherLevel>($w('#TeacherLevelsDataset')),
    loadFirstDatasetPage<AccountStatus>($w('#AccountStatusesDataset')),
  ]);
  state = {
    teacherLevels,
    accountStatuses,
    fieldValues: wixLocation.query,
  };
  await updateTeachersFilter();
  setupInputOnChange();

  $w('#resetFiltersButton' as 'Button').onClick(async () => {
    resetInputFieldValues(state.fieldValues);
    updateInputValueIfChanged(state.fieldValues);
    updateTeachersFilter();
  });

  $w('#teachersRepeater' as 'Repeater').onItemReady(($item, teacher: Teacher) => {
    $item('#teachersProfileImage' as 'Image').onClick(() => redirectToTeacher(teacher));
    $item('#teachersName' as 'Text').onClick(() => redirectToTeacher(teacher));
  });
});

function setupInputOnChange() {
  TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'TextInput');
    $input.value = state.fieldValues[field];
    $input.onInput((event: $w.Event) => onInputChange(field, event));
  });

  DROPDOWNS.forEach((field) => {
    const $dropdown = $w(`#${field}` as 'Dropdown');
    $dropdown.value = state.fieldValues[field];
    $dropdown.onChange((event: $w.Event) => onInputChange(field, event));
  });
}

async function onInputChange(field: string, event: $w.Event): Promise<void> {
  const value = event.target.value;
  state.fieldValues[field] = value;
  updateTeachersFilter();
}

async function updateTeachersFilter() {
  const values = state.fieldValues;
  const levelId =
    values.level && state.teacherLevels.find(({ title }) => title === values.level)?._id;
  const statusId = state.accountStatuses.find(({ title }) => title === AccountStatuses.NotATeacher)
    ?._id;

  const datasetFilter = getFilter([
    [values.fullName, (filter) => filter.contains('fullName', values.fullName)],
    [values.city, (filter) => filter.contains('city', values.city)],
    [levelId, (filter) => filter.eq('levelId', levelId)],
    [statusId, (filter) => filter.ne('statusId', statusId)],
  ]);

  await $w('#TeachersDataset').setFilter(datasetFilter);

  const $teachersRepeater = $w('#teachersRepeater' as 'Repeater');
  const $loadMoreButton = $w('#loadMoreButton' as 'Button');
  const $teachersEmptyState = $w('#teachersEmptyState' as 'Container');
  const $TeachersDataset = $w('#TeachersDataset');

  $TeachersDataset.onReady(() => {
    if ($TeachersDataset.getCurrentItem()) {
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

function redirectToTeacher(teacher: Teacher) {
  const { slug } = teacher;
  wixLocation.to(`/teacher/${slug}`);
}
