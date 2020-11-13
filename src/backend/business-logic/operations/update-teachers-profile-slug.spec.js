import { buildTeachersProfile } from '../../../test/builders/teachers-profile';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance } from '../../../test/utils/stubbing';
import { TeachersProfileRepository } from '../../repositories/teachers-profile-repository';
import { MAX_SLUG_POSTFIX, updateTeachersProfileSlugFactory } from './update-teachers-profile-slug';
describe('updateTeachersProfileSlug', () => {
    const fullName = 'John Doe';
    const slug = 'john-doe';
    const teachersProfile = buildTeachersProfile({ properties: { fullName }, without: ['slug'] });
    const getTeachersProfileRepository = (teachersProfile) => createStubInstance(TeachersProfileRepository, (stub) => {
        stub.fetchTeachersProfileBySlug.resolves(teachersProfile);
    });
    const buildTestContext = ({ teachersProfileRepository = getTeachersProfileRepository(undefined), } = {}) => ({
        teachersProfileRepository,
        updateTeachersProfileSlug: updateTeachersProfileSlugFactory(teachersProfileRepository),
    });
    it('should return teacher profile with slug', async () => {
        const { teachersProfileRepository, updateTeachersProfileSlug } = buildTestContext();
        expect(await updateTeachersProfileSlug(teachersProfile)).to.eql({ ...teachersProfile, slug });
        expect(teachersProfileRepository.fetchTeachersProfileBySlug).calledOnceWithExactly(slug);
    });
    context('on slug already taken', () => {
        const teachersProfile1 = buildTeachersProfile({ properties: { slug } });
        const teachersProfile2 = buildTeachersProfile({ properties: { slug: `${slug}-1` } });
        const teachersProfile3 = buildTeachersProfile({ properties: { slug: `${slug}-2` } });
        const getTeachersProfileRepository = () => createStubInstance(TeachersProfileRepository, (stub) => {
            stub.fetchTeachersProfileBySlug
                .onFirstCall()
                .resolves(teachersProfile1)
                .onSecondCall()
                .resolves(teachersProfile2)
                .onThirdCall()
                .resolves(teachersProfile3)
                .onCall(4)
                .resolves();
        });
        it('should generate with postfix', async () => {
            const { teachersProfileRepository, updateTeachersProfileSlug } = buildTestContext({
                teachersProfileRepository: getTeachersProfileRepository(),
            });
            expect(await updateTeachersProfileSlug(teachersProfile)).to.eql({
                ...teachersProfile,
                slug: `${slug}-3`,
            });
            expect(teachersProfileRepository.fetchTeachersProfileBySlug).callCount(4);
        });
    });
    context('on updating teachers profile with slug', () => {
        const teachersProfile = buildTeachersProfile({ properties: { fullName, slug } });
        it('should do nothing', async () => {
            const { teachersProfileRepository, updateTeachersProfileSlug } = buildTestContext({
                teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
            });
            expect(await updateTeachersProfileSlug(teachersProfile)).to.eql(teachersProfile);
            expect(teachersProfileRepository.fetchTeachersProfileBySlug).not.called;
        });
        context('on name change', () => {
            const fullName = 'Bob Davis';
            const newSlug = 'bob-davis';
            const teachersProfile = buildTeachersProfile({ properties: { fullName, slug } });
            it('should update slug', async () => {
                const { teachersProfileRepository, updateTeachersProfileSlug } = buildTestContext({
                    teachersProfileRepository: getTeachersProfileRepository(undefined),
                });
                expect(await updateTeachersProfileSlug(teachersProfile)).to.eql({
                    ...teachersProfile,
                    slug: newSlug,
                });
                expect(teachersProfileRepository.fetchTeachersProfileBySlug).calledOnceWithExactly(newSlug);
            });
        });
    });
    context('on empty slug not found', () => {
        it('should use id for slug', async () => {
            const { teachersProfileRepository, updateTeachersProfileSlug } = buildTestContext({
                teachersProfileRepository: getTeachersProfileRepository(teachersProfile),
            });
            expect(await updateTeachersProfileSlug(teachersProfile)).to.eql({
                ...teachersProfile,
                slug: teachersProfile._id,
            });
            expect(teachersProfileRepository.fetchTeachersProfileBySlug).callCount(MAX_SLUG_POSTFIX + 1);
        });
    });
});
