import { debounce, find, pick } from 'lodash';
import {
  AccountStatuses,
  AccountStatusIds,
  TeacherLevel,
  TeacherWix,
} from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getAccountStatuses } from 'public/global-state';
import { ImageDefault, setImageDefault } from 'public/images';
import { setupInputChangeHandlers } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { addWixLocationQueryParams, loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';

type TeachersFilter = {
  fullName: string;
  city: string;
  level: string;
};
type TeachersFilterKey = keyof TeachersFilter;

const TEXT_INPUTS: TeachersFilterKey[] = ['fullName', 'city'];
const DROPDOWNS: TeachersFilterKey[] = ['level'];
const FILTERS: TeachersFilterKey[] = [...TEXT_INPUTS, ...DROPDOWNS];

let state: {
  fieldValues: TeachersFilter;
  teacherLevels: TeacherLevel[];
  visibleAccountStatusIds: string[];
};

forCurrentTeacher('teachers', async () => {
  await setupInitialState();
  showTeachersOrLevels();
  await updateTeachersFilter();
  setupInputOnChange();
  addAllValueToLevelsDropdown();
  addTeacherLoadedHandler();
});

async function setupInitialState() {
  const [teacherLevels, accountStatuses] = await Promise.all([
    loadFirstDatasetPage<TeacherLevel>($w('#TeacherLevelsDataset')),
    getAccountStatuses(),
  ]);
  state = {
    teacherLevels,
    visibleAccountStatusIds: accountStatuses
      .filter(({ title }) => title !== AccountStatuses.NotATeacher)
      .map(({ _id }) => _id),
    fieldValues: pick(wixLocation.query, FILTERS),
  };
}

function showTeachersOrLevels() {
  const $levelsBox = $w('#levelsBox' as 'Box');
  const $teachersBox = $w('#teachersBox' as 'Box');
  if (find(state.fieldValues)) {
    $levelsBox.collapse();
    $teachersBox.expand();
  } else {
    $levelsBox.expand();
    $teachersBox.collapse();
  }

  state.teacherLevels.forEach((teacherLevel) => {
    $w(`#level${teacherLevel.order}` as 'Button').onClick(async () => {
      const field = 'level';
      const value = teacherLevel.title;
      $w(`#${field}` as 'Dropdown').value = value;
      addWixLocationQueryParams({ [field]: value });

      $levelsBox.collapse();
      await onInputChange(field, value);
      $teachersBox.expand();
    });
  });
}

function setupInputOnChange() {
  setupInputChangeHandlers(TEXT_INPUTS, DROPDOWNS);

  TEXT_INPUTS.forEach((field) => {
    const $input = $w(`#${field}` as 'TextInput');
    $input.value = state.fieldValues[field];
    $input.onInput(debounce((event: $w.Event) => onInputChange(field, event.target.value), 500));
  });

  DROPDOWNS.forEach((field) => {
    const $dropdown = $w(`#${field}` as 'Dropdown');
    $dropdown.value = state.fieldValues[field];
    $dropdown.onChange((event: $w.Event) => onInputChange(field, event.target.value));
  });
}

async function onInputChange(field: string, value: string): Promise<void> {
  state.fieldValues[field] = value;
  await updateTeachersFilter();
}

async function updateTeachersFilter() {
  const values = state.fieldValues;
  const levelId =
    values.level && state.teacherLevels.find(({ title }) => title === values.level)?._id;

  const datasetFilter = getFilter([
    [values.fullName, (filter) => filter.contains('fullName', values.fullName)],
    [values.city, (filter) => filter.contains('city', values.city)],
    [levelId, (filter) => filter.eq('levelId', levelId)],
    [
      state.visibleAccountStatusIds,
      (filter) => filter.hasSome('statusId', state.visibleAccountStatusIds),
    ],
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

function redirectToTeacher(teacher: TeacherWix) {
  const { slug } = teacher;
  wixLocation.to(`/teacher/${slug}`);
}

function addAllValueToLevelsDropdown() {
  $w('#TeacherLevelsDataset').onReady(() => {
    const $dropdown = $w('#level' as 'Dropdown');
    $dropdown.options = [{ label: 'All', value: '' }, ...$dropdown.options];
  });
}

function addTeacherLoadedHandler() {
  $w('#teachersRepeater' as 'Repeater').onItemReady(($item, teacher: TeacherWix) => {
    const $profileImage = $item('#teachersProfileImage' as 'Image');
    setImageDefault(teacher.profileImage, $profileImage, ImageDefault.Profile);
    $profileImage.onClick(() => redirectToTeacher(teacher));
    $item('#teachersProfileImage' as 'Image').onClick(() => redirectToTeacher(teacher));
    $item('#teachersName' as 'Text').onClick(() => redirectToTeacher(teacher));
    if (
      ((teacher.statusId as unknown) as string) === AccountStatusIds.Active ||
      teacher.statusId?.title === AccountStatuses.Active
    ) {
      $item('#teachersStatusActive' as 'Text').expand();
    } else {
      $item('#teachersStatusInactive' as 'Text').expand();
    }
  });
}
