import { Teacher } from '../../../common/entities/teacher';
import { buildAdminFilledTeacher, buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { createStubInstance, stubFn } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
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

  const getTeachersRepository = (teacher?: Teacher) =>
    createStubInstance(TeachersRepository, (stub) => {
      stub.fetchTeacherBySlug.resolves(teacher);
    });
  const getGenerateUuid = (uuid: string) => stubFn<IdProvider>().returns(uuid);
  const buildTestContext = ({
    teachersRepository = getTeachersRepository(),
    generateUuid = getGenerateUuid(uuid),
  } = {}) => ({
    teachersRepository,
    generateUuid,
    normalizeTeacher: normalizeTeacherFactory(teachersRepository, generateUuid),
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
      createStubInstance(TeachersRepository, (stub) => {
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
});
