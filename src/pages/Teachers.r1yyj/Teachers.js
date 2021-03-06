import { debounce, find, pick } from 'lodash';
import { AccountStatuses } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getAccountStatuses } from 'public/global-state';
import { ImageDefault, setImageDefault } from 'public/images';
import { setupInputChangeHandlers } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { addWixLocationQueryParams, loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';
const TEXT_INPUTS = ['fullName', 'city', 'modules'];
const DROPDOWNS = ['level'];
const FILTERS = [...TEXT_INPUTS, ...DROPDOWNS];
let state;
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
        loadFirstDatasetPage($w('#TeacherLevelsDataset')),
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
    const $levelsBox = $w('#levelsBox');
    const $teachersBox = $w('#teachersBox');
    if (find(state.fieldValues)) {
        $levelsBox.collapse();
        $teachersBox.expand();
    }
    else {
        $levelsBox.expand();
        $teachersBox.collapse();
    }
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
function addAllValueToLevelsDropdown() {
    $w('#TeacherLevelsDataset').onReady(() => {
        const $dropdown = $w('#level');
        $dropdown.options = [{ label: 'All', value: '' }, ...$dropdown.options];
    });
}
function addTeacherLoadedHandler() {
    $w('#teachersRepeater').onItemReady(($item, teacher) => {
        var _a;
        const $profileImage = $item('#teachersProfileImage');
        setImageDefault(teacher.profileImage, $profileImage, ImageDefault.Profile);
        $profileImage.onClick(() => redirectToTeacher(teacher));
        $item('#teachersProfileImage').onClick(() => redirectToTeacher(teacher));
        $item('#teachersName').onClick(() => redirectToTeacher(teacher));
        if (((_a = teacher.statusId) === null || _a === void 0 ? void 0 : _a.title) === AccountStatuses.Active) {
            $item('#teachersStatusActive').expand();
        }
        else {
            $item('#teachersStatusInactive').expand();
        }
    });
}
