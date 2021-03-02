import { compact, get, keyBy, omit } from 'lodash';
export function makeTeacherViewsFactory(countriesRepository, languagesRepository) {
    return async function makeTeacherViews(teachersArray) {
        const teachers = compact(teachersArray);
        const countryIds = compact(teachers.map((teacher) => teacher.countryId));
        const languageIds = compact(teachers.map((teacher) => teacher.languageId));
        const [countries, languages] = await Promise.all([
            countryIds.length ? countriesRepository.fetchCountriesByIds(countryIds) : Promise.resolve([]),
            languageIds.length
                ? languagesRepository.fetchLanguagesByIds(languageIds)
                : Promise.resolve([]),
        ]);
        const countriesByIds = keyBy(countries, '_id');
        const languagesByIds = keyBy(languages, '_id');
        return teachers.map((teacher) => ({
            ...omit(teacher, ['streetAddress']),
            facebook: teacher.facebook || '',
            instagram: teacher.instagram || '',
            linkedIn: teacher.linkedIn || '',
            website: teacher.website || '',
            about: teacher.about || '',
            photos: teacher.photos || [],
            completedTasks: teacher.completedTasks || [],
            country: get(countriesByIds[teacher.countryId], 'title'),
            language: get(languagesByIds[teacher.languageId], 'title'),
        }));
    };
}
