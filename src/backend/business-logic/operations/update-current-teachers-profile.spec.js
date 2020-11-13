import { omit, pick } from 'lodash';
import { TaskNumber } from '../../../common/types/task';
import { buildCountry } from '../../../test/builders/country';
import { buildLanguage } from '../../../test/builders/language';
import { buildRegisteredTeachersInfo } from '../../../test/builders/teachers-info';
import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { CountryRepository } from '../../repositories/country-repository';
import { LanguageRepository } from '../../repositories/language-repository';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { InvalidRequestError } from '../../utils/errors';
import { updateCurrentTeachersProfileFactory } from './update-current-teachers-profile';
describe('updateCurrentTeachersProfile', () => {
    const country = buildCountry();
    const language = buildLanguage();
    const teachersInfo = buildRegisteredTeachersInfo({
        properties: { firstName: 'John', lastName: 'Doe' },
    });
    const fullName = `${teachersInfo.firstName} ${teachersInfo.lastName}`;
    const slug = 'john-doe';
    const teachersProfile = buildTeachersProfile({
        properties: { userId: teachersInfo.userId, email: teachersInfo.email, fullName, slug },
    });
    const update = {
        ...pick(buildTeachersProfile(), ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
        country: country.title,
        language: language.title,
    };
    const updatedTeachersProfile = {
        ...teachersProfile,
        ...pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
        countryId: country._id,
        languageId: language._id,
    };
    const getTeachersProfileRepository = (teachersProfile, returnedTeachersProfile) => createStubInstance(TeachersProfileRepository, (stub) => {
        stub.fetchTeachersProfileByEmail.resolves(teachersProfile);
        stub.updateTeachersProfile.resolves(returnedTeachersProfile);
        stub.insertTeachersProfile.resolves(returnedTeachersProfile);
    });
    const getCountryRepository = (country) => createStubInstance(CountryRepository, (stub) => {
        stub.fetchCountryByTitleOrThrow.resolves(country);
    });
    const getLanguageRepository = (language) => createStubInstance(LanguageRepository, (stub) => {
        stub.fetchLanguageByTitleOrThrow.resolves(language);
    });
    const getGetCurrentTeachersInfo = (teachersInfo) => stubFn().resolves(teachersInfo);
    const getCompleteTeachersTask = () => stubFn().resolves();
    const buildTestContext = ({ teachersProfileRepository = getTeachersProfileRepository(teachersProfile, updatedTeachersProfile), countryRepository = getCountryRepository(country), languageRepository = getLanguageRepository(language), getCurrentTeachersInfo = getGetCurrentTeachersInfo(teachersInfo), completeTeachersTask = getCompleteTeachersTask(), } = {}) => ({
        teachersProfileRepository,
        languageRepository,
        getCurrentTeachersInfo,
        completeTeachersTask,
        updateCurrentTeachersProfile: updateCurrentTeachersProfileFactory(teachersProfileRepository, countryRepository, languageRepository, getCurrentTeachersInfo, completeTeachersTask),
    });
    it('should update, return current teacher profile and complete task', async () => {
        const { teachersProfileRepository, languageRepository, getCurrentTeachersInfo, completeTeachersTask, updateCurrentTeachersProfile, } = buildTestContext();
        expect(await updateCurrentTeachersProfile(update)).to.eql(updatedTeachersProfile);
        expect(getCurrentTeachersInfo).calledOnceWithExactly();
        expect(languageRepository.fetchLanguageByTitleOrThrow).calledOnceWithExactly(language.title);
        expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(teachersInfo.email);
        expect(teachersProfileRepository.updateTeachersProfile).calledOnceWithExactly(updatedTeachersProfile);
        expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.initialProfileForm);
    });
    context('on profile not existing', () => {
        const teachersProfile = undefined;
        const createdTeachersProfile = {
            ...pick(update, ['profileImage', 'phoneNumber', 'city', 'streetAddress']),
            ...pick(teachersInfo, ['email', 'userId', 'levelId', 'statusId']),
            countryId: country._id,
            languageId: language._id,
            fullName,
            slug,
            teachersInfoId: teachersInfo._id,
        };
        it('should create a new teachers profile and complete task', async () => {
            const { teachersProfileRepository, updateCurrentTeachersProfile, completeTeachersTask, } = buildTestContext({
                teachersProfileRepository: getTeachersProfileRepository(teachersProfile, createdTeachersProfile),
            });
            expect(await updateCurrentTeachersProfile(update)).to.eql(createdTeachersProfile);
            expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(teachersInfo.email);
            expect(teachersProfileRepository.insertTeachersProfile).calledOnceWithExactly(omit(createdTeachersProfile, 'slug'));
            expect(completeTeachersTask).calledOnceWithExactly(TaskNumber.initialProfileForm);
        });
        context('on update validation failed', () => {
            const update = { phoneNumber: '11', city: 'a' };
            it('should return human readable error', async () => {
                const { teachersProfileRepository, updateCurrentTeachersProfile } = buildTestContext();
                await expect(updateCurrentTeachersProfile(update)).rejectedWith(/field is required/);
                expect(teachersProfileRepository.fetchTeachersProfileByEmail).not.called;
            });
        });
        context('on insert failed', () => {
            const error = new InvalidRequestError();
            const getTeachersProfileRepository = (teachersProfile) => createStubInstance(TeachersProfileRepository, (stub) => {
                stub.fetchTeachersProfileByEmail.resolves(teachersProfile);
                stub.insertTeachersProfile.rejects(error);
            });
            it('should throw', async () => {
                const { teachersProfileRepository, updateCurrentTeachersProfile } = buildTestContext({
                    teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
                });
                await expect(updateCurrentTeachersProfile(update)).rejectedWith(error);
                expect(teachersProfileRepository.fetchTeachersProfileByEmail).calledOnceWithExactly(teachersInfo.email);
            });
        });
    });
});
