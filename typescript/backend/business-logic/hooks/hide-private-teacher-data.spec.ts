import { omit } from 'lodash';
import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';
import { hidePrivateTeacherDataFactory } from './hide-private-teacher-data';

describe('hidePrivateTeacherData', function () {
  const teacher = buildTeacher();
  const buildTestContext = () => ({
    hidePrivateTeacherData: hidePrivateTeacherDataFactory(),
  });

  it('should return public teacher data', async () => {
    const { hidePrivateTeacherData } = buildTestContext();
    expect(await hidePrivateTeacherData(teacher)).to.eql(omit(teacher, 'phoneNumber'));
  });
});
