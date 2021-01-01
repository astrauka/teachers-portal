import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { Teacher } from '../../common/entities/teacher';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { getCuratingTeacherFactory } from './get-curating-teacher';
import { GetTeacher } from './get-teacher';

describe('getCuratingTeacher', () => {
  const curatingTeacher = buildTeacher({ id: 'curating' });
  const currentTeacher = buildTeacher({
    id: 'current',
    properties: { mentorId: curatingTeacher._id },
  });

  const getTeachersRepository = (teacher: Teacher) =>
    stubType<TeachersRepository>((stub) => {
      stub.fetchTeacherById.resolves(teacher);
    });
  const getGetTeacher = (teacher: Teacher) => stubFn<GetTeacher>().resolves(teacher);
  const buildTestContext = ({
    getTeacher = getGetTeacher(currentTeacher),
    teachersRepository = getTeachersRepository(curatingTeacher),
  } = {}) => ({
    getTeacher,
    teachersRepository,
    getCuratingTeacher: getCuratingTeacherFactory(getTeacher, teachersRepository),
  });

  it('should return curating teacher', async () => {
    const { getTeacher, teachersRepository, getCuratingTeacher } = buildTestContext();
    expect(await getCuratingTeacher()).to.eql(curatingTeacher);
    expect(getTeacher).calledOnceWithExactly();
    expect(teachersRepository.fetchTeacherById).calledOnceWithExactly(currentTeacher.mentorId);
  });

  context('for teacher without mentor', () => {
    const currentTeacher = buildTeacher({ without: ['mentorId'] });

    it('should return undefined', async () => {
      const { getTeacher, teachersRepository, getCuratingTeacher } = buildTestContext({
        getTeacher: getGetTeacher(currentTeacher),
      });
      expect(await getCuratingTeacher()).to.be.undefined;
      expect(getTeacher).calledOnceWithExactly();
      expect(teachersRepository.fetchTeacherById).not.called;
    });
  });

  context('on mentor deleted', () => {
    const curatingTeacher = undefined;

    it('should return undefined', async () => {
      const { getTeacher, teachersRepository, getCuratingTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(curatingTeacher),
      });
      expect(await getCuratingTeacher()).to.be.undefined;
      expect(getTeacher).calledOnceWithExactly();
      expect(teachersRepository.fetchTeacherById).calledOnceWithExactly(currentTeacher.mentorId);
    });
  });
});
