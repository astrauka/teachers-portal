import { debounce, find, pick } from 'lodash';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getAccountStatuses } from 'public/global-state';
import { setupInputChangeHandlers } from 'public/inputs-location';
import { addTeacherLoadedHandler } from 'public/teachers';
import { AccountStatuses, TeacherLevel } from 'public/universal/entities/teacher';
import { getFilter } from 'public/wix-filter';
import { addWixLocationQueryParams, expandIfHasData, loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';

type TeachersFilter = {
  fullName: string;
  city: string;
  level: string;
  modules: string;
};
type TeachersFilterKey = keyof TeachersFilter;

const TEXT_INPUTS: TeachersFilterKey[] = ['fullName', 'city', 'modules'];
const DROPDOWNS: TeachersFilterKey[] = ['level'];
const FILTERS: TeachersFilterKey[] = [...TEXT_INPUTS, ...DROPDOWNS];

let state: {
  fieldValues: TeachersFilter;
  teacherLevels: TeacherLevel[];
  visibleAccountStatusIds: string[];
};

forCurrentTeacher('teachers', async () => {
  showTeacherLevels();
  addAllValueToLevelsDropdown();
  addTeacherLoadedHandler();
  await setupInitialState();
  setupTeacherLevelsButtonsOnClick();
  await updateTeachersFilter();
  setupInputOnChange();
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
    fieldValues: getFieldValuesFromLocationQuery(),
  };
}

function getFieldValuesFromLocationQuery(): TeachersFilter {
  return pick(wixLocation.query, FILTERS);
}

function showTeacherLevels() {
  $w('#teachersBox' as 'Box').collapse();
  const isAnyFilterApplied = Boolean(find(getFieldValuesFromLocationQuery()));
  expandIfHasData($w('#levelsBox' as 'Box'), !isAnyFilterApplied);
}

function setupTeacherLevelsButtonsOnClick() {
  const $levelsBox = $w('#levelsBox' as 'Box');
  if (!$levelsBox.collapsed) {
    const $teachersBox = $w('#teachersBox' as 'Box');
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
    [values.modules, (filter) => filter.contains('modules', values.modules)],
    [levelId, (filter) => filter.eq('levelId', levelId)],
    [
      state.visibleAccountStatusIds,
      (filter) => filter.hasSome('statusId', state.visibleAccountStatusIds),
    ],
  ]);

  await $w('#TeachersDataset').setFilter(datasetFilter);
  if (levelId) {
    $w('#teachersBox' as 'Box').expand();
  }

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

function addAllValueToLevelsDropdown() {
  $w('#TeacherLevelsDataset').onReady(() => {
    const $dropdown = $w('#level' as 'Dropdown');
    $dropdown.options = [{ label: 'All', value: '' }, ...$dropdown.options];
  });
}
