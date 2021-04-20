import { debounce, find, pick } from 'lodash';
import { AccountStatuses } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getAccountStatuses } from 'public/global-state';
import { setupInputChangeHandlers } from 'public/inputs-location';
import { addTeacherLoadedHandler } from 'public/teachers';
import { getFilter } from 'public/wix-filter';
import { addWixLocationQueryParams, expandIfHasData, loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';
const TEXT_INPUTS = ['fullName', 'city', 'modules'];
const DROPDOWNS = ['level'];
const FILTERS = [...TEXT_INPUTS, ...DROPDOWNS];
let state;
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
        loadFirstDatasetPage($w('#TeacherLevelsDataset')),
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
function getFieldValuesFromLocationQuery() {
    return pick(wixLocation.query, FILTERS);
}
function showTeacherLevels() {
    $w('#teachersBox').collapse();
    const isAnyFilterApplied = Boolean(find(getFieldValuesFromLocationQuery()));
    expandIfHasData($w('#levelsBox'), !isAnyFilterApplied);
}
function setupTeacherLevelsButtonsOnClick() {
    const $levelsBox = $w('#levelsBox');
    if (!$levelsBox.collapsed) {
        const $teachersBox = $w('#teachersBox');
        state.teacherLevels.forEach((teacherLevel) => {
            $w(`#level${teacherLevel.order}`).onClick(async () => {
                const field = 'level';
                const value = teacherLevel.title;
                $w(`#${field}`).value = value;
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
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onInput(debounce((event) => onInputChange(field, event.target.value), 500));
    });
    DROPDOWNS.forEach((field) => {
        const $dropdown = $w(`#${field}`);
        $dropdown.value = state.fieldValues[field];
        $dropdown.onChange((event) => onInputChange(field, event.target.value));
    });
}
async function onInputChange(field, value) {
    state.fieldValues[field] = value;
    await updateTeachersFilter();
}
async function updateTeachersFilter() {
    var _a;
    const values = state.fieldValues;
    const levelId = values.level && ((_a = state.teacherLevels.find(({ title }) => title === values.level)) === null || _a === void 0 ? void 0 : _a._id);
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
        $w('#teachersBox').expand();
    }
    const $teachersRepeater = $w('#teachersRepeater');
    const $loadMoreButton = $w('#loadMoreButton');
    const $teachersEmptyState = $w('#teachersEmptyState');
    const $TeachersDataset = $w('#TeachersDataset');
    $TeachersDataset.onReady(() => {
        if ($TeachersDataset.getCurrentItem()) {
            $teachersRepeater.expand();
            $loadMoreButton.expand();
            $teachersEmptyState.collapse();
        }
        else {
            $teachersRepeater.collapse();
            $loadMoreButton.collapse();
            $teachersEmptyState.expand();
        }
    });
}
function addAllValueToLevelsDropdown() {
    $w('#TeacherLevelsDataset').onReady(() => {
        const $dropdown = $w('#level');
        $dropdown.options = [{ label: 'All', value: '' }, ...$dropdown.options];
    });
}
