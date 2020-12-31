import { AccountStatuses, } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { resetInputFieldValues, updateInputValueIfChanged } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';
const TEXT_INPUTS = ['fullName', 'city'];
const DROPDOWNS = ['level'];
let state;
forCurrentTeacher(async () => {
    const [teacherLevels, accountStatuses] = await Promise.all([
        loadFirstDatasetPage($w('#TeacherLevelsDataset')),
        loadFirstDatasetPage($w('#AccountStatusesDataset')),
    ]);
    state = {
        teacherLevels,
        accountStatuses,
        fieldValues: wixLocation.query,
    };
    await updateTeachersFilter();
    setupInputOnChange();
    $w('#resetFiltersButton').onClick(async () => {
        resetInputFieldValues(state.fieldValues);
        updateInputValueIfChanged(state.fieldValues);
        updateTeachersFilter();
    });
    $w('#teachersRepeater').onItemReady(($item, teacher) => {
        $item('#teachersProfileImage').onClick(() => redirectToTeacher(teacher));
        $item('#teachersName').onClick(() => redirectToTeacher(teacher));
    });
});
function setupInputOnChange() {
    TEXT_INPUTS.forEach((field) => {
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onInput((event) => onInputChange(field, event));
    });
    DROPDOWNS.forEach((field) => {
        const $dropdown = $w(`#${field}`);
        $dropdown.value = state.fieldValues[field];
        $dropdown.onChange((event) => onInputChange(field, event));
    });
}
async function onInputChange(field, event) {
    const value = event.target.value;
    state.fieldValues[field] = value;
    updateTeachersFilter();
}
async function updateTeachersFilter() {
    var _a, _b;
    const values = state.fieldValues;
    const levelId = values.level && ((_a = state.teacherLevels.find(({ title }) => title === values.level)) === null || _a === void 0 ? void 0 : _a._id);
    const statusId = (_b = state.accountStatuses.find(({ title }) => title === AccountStatuses.NotATeacher)) === null || _b === void 0 ? void 0 : _b._id;
    const datasetFilter = getFilter([
        [values.fullName, (filter) => filter.contains('fullName', values.fullName)],
        [values.city, (filter) => filter.contains('city', values.city)],
        [levelId, (filter) => filter.eq('levelId', levelId)],
        [statusId, (filter) => filter.ne('statusId', statusId)],
    ]);
    await $w('#TeachersDataset').setFilter(datasetFilter);
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
function redirectToTeacher(teacher) {
    const { slug } = teacher;
    wixLocation.to(`/teacher/${slug}`);
}
