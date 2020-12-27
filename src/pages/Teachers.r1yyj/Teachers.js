import { AccountStatuses } from 'public/common/entities/teachers-info';
import { forLoggedInUser } from 'public/for-logged-in-user';
import { resetInputFieldValues, setupInputChangeHandlers, updateInputValueIfChanged, } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import { loadFirstDatasetPage } from 'public/wix-utils';
import wixLocation from 'wix-location';
const INPUT_FIELDS = {
    '#nameInput': 'fullName',
    '#cityInput': 'city',
    '#levelDropdown': 'level',
};
let state;
$w.onReady(() => forLoggedInUser(async () => {
    state = {
        teachersLevelsPromise: loadFirstDatasetPage($w('#TeacherLevelsDataset')),
        accountStatusPromise: loadFirstDatasetPage($w('#AccountStatusesDataset')),
    };
    updateInputValueIfChanged(INPUT_FIELDS, $w);
    setupInputChangeHandlers(INPUT_FIELDS, $w);
    $w('#resetFiltersButton').onClick(async () => {
        resetInputFieldValues(INPUT_FIELDS);
    });
    wixLocation.onChange(async () => {
        updateInputValueIfChanged(INPUT_FIELDS, $w);
        await updateTeachersFilter($w);
    });
    await updateTeachersFilter($w);
}));
export function teachersName_click(event) {
    const $teacher = $w.at(event.context);
    const { slug } = $teacher('#TeachersProfileDataset').getCurrentItem();
    wixLocation.to(`/teacher/${slug}`);
}
async function updateTeachersFilter($w) {
    var _a, _b;
    const values = wixLocation.query;
    const levelId = values.level && ((_a = (await state.teachersLevelsPromise).find(({ title }) => title === values.level)) === null || _a === void 0 ? void 0 : _a._id);
    const statusId = (_b = (await state.accountStatusPromise).find(({ title }) => title === AccountStatuses.NotATeacher)) === null || _b === void 0 ? void 0 : _b._id;
    const datasetFilter = getFilter([
        [values.fullName, (filter) => filter.contains('fullName', values.fullName)],
        [values.city, (filter) => filter.contains('city', values.city)],
        [levelId, (filter) => filter.eq('levelId', levelId)],
        [statusId, (filter) => filter.ne('statusId', statusId)],
    ]);
    await $w('#TeachersProfileDataset').setFilter(datasetFilter);
    const $teachersRepeater = $w('#teachersRepeater');
    const $loadMoreButton = $w('#loadMoreButton');
    const $teachersEmptyState = $w('#teachersEmptyState');
    const $TeachersProfileDataset = $w('#TeachersProfileDataset');
    $TeachersProfileDataset.onReady(() => {
        if ($TeachersProfileDataset.getCurrentItem()) {
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
