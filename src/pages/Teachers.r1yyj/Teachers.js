import { resetInputFieldValues, setupInputChangeHandlers, updateInputValueIfChanged, } from 'public/inputs-location';
import { getFilter } from 'public/wix-filter';
import wixLocation from 'wix-location';
const INPUT_FIELDS = {
    '#nameInput': 'fullName',
    '#cityInput': 'city',
    '#levelDropdown': 'level',
};
$w.onReady(async function () {
    const teachersLevelsPromise = getTeacherLevels($w);
    updateInputValueIfChanged(INPUT_FIELDS, $w);
    setupInputChangeHandlers(INPUT_FIELDS, $w);
    updateTeachersFilter($w, teachersLevelsPromise);
    wixLocation.onChange(async () => {
        updateInputValueIfChanged(INPUT_FIELDS, $w);
        await updateTeachersFilter($w, teachersLevelsPromise);
    });
    $w('#resetFiltersButton').onClick(async () => {
        resetInputFieldValues(INPUT_FIELDS);
    });
});
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
    $w('#TeachersProfileDataset').onReady(() => {
        if ($w('#TeachersProfileDataset').getCurrentItem()) {
            $w('#teachersRepeater').expand();
            $w('#loadMoreButton').expand();
            $w('#teachersEmptyState').collapse();
        }
        else {
            $w('#teachersRepeater').collapse();
            $w('#loadMoreButton').collapse();
            $w('#teachersEmptyState').expand();
        }
    });
}
