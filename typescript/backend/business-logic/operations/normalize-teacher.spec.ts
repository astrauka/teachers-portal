import { Teacher } from '../../../common/entities/teacher';
import { buildAdminFilledTeacher, buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { UsersService } from '../../services/users-service';
import { IdProvider } from '../../utils/id';
import { MAX_SLUG_POSTFIX, normalizeTeacherFactory, TEACHER_DEFAULTS } from './normalize-teacher';

describe('normalizeTeacher', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const fullName = `${firstName} ${lastName}`;
  const slug = 'john-doe';
  const update = buildAdminFilledTeacher({
    properties: { firstName, lastName },
    without: ['certificateExpirationDate'],
  });
  const uuid = 'generated-id';

  const getUsersService = () =>
    stubType<UsersService>((stub) => {
      stub.updateUserFields.resolves();
    });
  const getTeachersRepository = (teacher?: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.fetchTeacherBySlug.resolves(teacher);
    });
  const getGenerateUuid = (uuid: string) => stubFn<IdProvider>().returns(uuid);
  const buildTestContext = ({
    usersService = getUsersService(),
    teachersRepository = getTeachersRepository(),
    generateUuid = getGenerateUuid(uuid),
  } = {}) => ({
    usersService,
    teachersRepository,
    generateUuid,
    normalizeTeacher: normalizeTeacherFactory(usersService, teachersRepository, generateUuid),
  });

  it('should return teacher with defaults, fullName and slug', async () => {
    const { teachersRepository, generateUuid, normalizeTeacher } = buildTestContext();
    expect(await normalizeTeacher(update)).to.eql({
      ...TEACHER_DEFAULTS,
      ...update,
      fullName,
      slug,
    });
    expect(teachersRepository.fetchTeacherBySlug).calledOnceWithExactly(slug);
    expect(generateUuid).not.called;
  });

  context('on slug already taken', () => {
    const teacher1 = buildTeacher({ properties: { slug } });
    const teacher2 = buildTeacher({ properties: { slug: `${slug}-1` } });
    const teacher3 = buildTeacher({ properties: { slug: `${slug}-2` } });
    const getTeachersRepository = () =>
      stubType<TeachersRepository>((stub) => {
        stub.fetchTeacherBySlug
          .onFirstCall()
          .resolves(teacher1)
          .onSecondCall()
          .resolves(teacher2)
          .onThirdCall()
          .resolves(teacher3)
          .onCall(4)
          .resolves();
      });

    it('should generate with postfix', async () => {
      const { teachersRepository, generateUuid, normalizeTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(),
      });

      expect(await normalizeTeacher(update)).to.eql({
        ...TEACHER_DEFAULTS,
        ...update,
        fullName,
        slug: `${slug}-3`,
      });
      expect(teachersRepository.fetchTeacherBySlug).callCount(4);
      expect(generateUuid).not.called;
    });
  });

  context('on updating teacher with slug', () => {
    const teacher = buildTeacher({ properties: { firstName, lastName, fullName, slug } });

    it('should do nothing', async () => {
      const { teachersRepository, normalizeTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(teacher),
      });
      expect(await normalizeTeacher(teacher)).to.eql(teacher);
      expect(teachersRepository.fetchTeacherBySlug).not.called;
    });

    context('on name change', () => {
      const firstName = 'Bob';
      const fullName = `${firstName} ${lastName}`;
      const newSlug = 'bob-doe';
      const update = buildTeacher({ properties: { firstName, lastName, slug } });

      it('should update slug', async () => {
        const { teachersRepository, normalizeTeacher } = buildTestContext();
        expect(await normalizeTeacher(update)).to.eql({
          ...TEACHER_DEFAULTS,
          ...update,
          fullName,
          slug: newSlug,
        });
        expect(teachersRepository.fetchTeacherBySlug).calledOnceWithExactly(newSlug);
      });
    });
  });

  context('on empty slug not found', () => {
    const existingTeacher = buildTeacher({ properties: { slug } });

    it('should use id for slug', async () => {
      const { teachersRepository, generateUuid, normalizeTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(existingTeacher),
      });
      expect(await normalizeTeacher(update)).to.eql({
        ...TEACHER_DEFAULTS,
        ...update,
        fullName,
        slug: uuid,
      });
      expect(teachersRepository.fetchTeacherBySlug).callCount(MAX_SLUG_POSTFIX + 1);
      expect(generateUuid).calledOnceWithExactly();
    });
  });

  context.skip('on profile image updated', () => {
    const update = buildTeacher();
    const userId = 'current-user-id';

    it('should update site member profile image', async () => {
      const { usersService, normalizeTeacher } = buildTestContext();
      await normalizeTeacher(update);
      expect(usersService.updateUserFields).calledOnceWithExactly(userId, {
        firstName,
        lastName,
        profileImage: { url: update.profileImage },
      });
    });
  });

  describe('social links', () => {
    const facebookUsername = 'facebook-username';
    const instagramUsername = 'instagram.username';
    const linkedInUsername = 'linked-in-username';

    const update = buildTeacher({
      properties: {
        facebook: `https://www.facebook.com/${facebookUsername}`,
        instagram: `https://www.instagram.com/${instagramUsername}`,
        linkedIn: `https://www.linkedin.com/in/${linkedInUsername}`,
      },
    });

    it('should persist usernames without site root', async () => {
      const { normalizeTeacher } = buildTestContext();
      expect(await normalizeTeacher(update)).to.deep.include({
        facebook: facebookUsername,
        instagram: instagramUsername,
        linkedIn: linkedInUsername,
      });
    });

    context('on mobile social links', () => {
      const update = buildTeacher({
        properties: {
          facebook: `https://m.facebook.com/${facebookUsername}`,
          instagram: `https://www.instagram.com/${instagramUsername}`,
          linkedIn: `https://www.linkedin.com/in/${linkedInUsername}`,
        },
      });

      it('should persist usernames without site root', async () => {
        const { normalizeTeacher } = buildTestContext();
        expect(await normalizeTeacher(update)).to.deep.include({
          facebook: facebookUsername,
          instagram: instagramUsername,
          linkedIn: linkedInUsername,
        });
      });
    });
  });
});
