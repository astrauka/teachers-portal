import { debounce } from 'lodash';
import { AccountStatuses, } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { setupInputChangeHandlers } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';
const TEXT_INPUTS = ['fullName', 'city'];
const DROPDOWNS = ['level'];
let state;
forCurrentTeacher('teachers', async () => {
    const [teacherLevels, accountStatuses] = await Promise.all([
        loadFirstDatasetPage($w('#TeacherLevelsDataset')),
        loadFirstDatasetPage($w('#AccountStatusesDataset')),
    ]);
    state = {
        teacherLevels,
        visibleAccountStatusIds: accountStatuses
            .filter(({ title }) => title !== AccountStatuses.NotATeacher)
            .map(({ _id }) => _id),
        fieldValues: wixLocation.query,
    };
    await updateTeachersFilter();
    setupInputOnChange();
    $w('#TeacherLevelsDataset').onReady(() => {
        const $dropdown = $w('#level');
        $dropdown.options = [{ label: 'All', value: '' }, ...$dropdown.options];
    });
    $w('#teachersRepeater').onItemReady(($item, teacher) => {
        $item('#teachersProfileImage').onClick(() => redirectToTeacher(teacher));
        $item('#teachersName').onClick(() => redirectToTeacher(teacher));
    });
});
function setupInputOnChange() {
    setupInputChangeHandlers(TEXT_INPUTS, DROPDOWNS);
    TEXT_INPUTS.forEach((field) => {
        const $input = $w(`#${field}`);
        $input.value = state.fieldValues[field];
        $input.onInput(debounce((event) => onInputChange(field, event), 500));
    });
    DROPDOWNS.forEach((field) => {
        const $dropdown = $w(`#${field}`);
        $dropdown.value = state.fieldValues[field];
        $dropdown.onChange((event) => onInputChange(field, event));
    });
}
async function onInputChange(field, event) {
    state.fieldValues[field] = event.target.value;
    updateTeachersFilter();
}
async function updateTeachersFilter() {
    var _a;
    const values = state.fieldValues;
    const levelId = values.level && ((_a = state.teacherLevels.find(({ title }) => title === values.level)) === null || _a === void 0 ? void 0 : _a._id);
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
