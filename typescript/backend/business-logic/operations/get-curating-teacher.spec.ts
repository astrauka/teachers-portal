import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { stubFn, stubType } from '../../../test/utils/stubbing';
import { TeachersRepository } from '../../repositories/teachers-repository';
import { Teacher } from '../../universal/entities/teacher';

import { getCuratingTeacherFactory } from './get-curating-teacher';
import { GetCurrentTeacher } from './get-current-teacher';

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
  const getGetTeacher = (teacher: Teacher) => stubFn<GetCurrentTeacher>().resolves(teacher);
  const buildTestContext = ({
    getCurrentTeacher = getGetTeacher(currentTeacher),
    teachersRepository = getTeachersRepository(curatingTeacher),
  } = {}) => ({
    getCurrentTeacher,
    teachersRepository,
    getCuratingTeacher: getCuratingTeacherFactory(getCurrentTeacher, teachersRepository),
  });

  it('should return curating teacher', async () => {
    const { getCurrentTeacher, teachersRepository, getCuratingTeacher } = buildTestContext();
    expect(await getCuratingTeacher()).to.eql(curatingTeacher);
    expect(getCurrentTeacher).calledOnceWithExactly();
    expect(teachersRepository.fetchTeacherById).calledOnceWithExactly(currentTeacher.mentorId);
  });

  context('for teacher without mentor', () => {
    const currentTeacher = buildTeacher({ without: ['mentorId'] });

    it('should return undefined', async () => {
      const { getCurrentTeacher, teachersRepository, getCuratingTeacher } = buildTestContext({
        getCurrentTeacher: getGetTeacher(currentTeacher),
      });
      expect(await getCuratingTeacher()).to.be.undefined;
      expect(getCurrentTeacher).calledOnceWithExactly();
      expect(teachersRepository.fetchTeacherById).not.called;
    });
  });

  context('on mentor deleted', () => {
    const curatingTeacher = undefined;

    it('should return undefined', async () => {
      const { getCurrentTeacher, teachersRepository, getCuratingTeacher } = buildTestContext({
        teachersRepository: getTeachersRepository(curatingTeacher),
      });
      expect(await getCuratingTeacher()).to.be.undefined;
      expect(getCurrentTeacher).calledOnceWithExactly();
      expect(teachersRepository.fetchTeacherById).calledOnceWithExactly(currentTeacher.mentorId);
    });
  });
});
