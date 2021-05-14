import { omit } from 'lodash';

import { buildTeacher } from '../../../test/builders/teacher';
import { expect } from '../../../test/utils/expectations';

import { makeTeacherViewFactory } from './make-teacher-view';

describe('makeTeacherView', function () {
  const teacher = buildTeacher();
  const buildTestContext = () => ({
    makeTeacherView: makeTeacherViewFactory(),
  });

  it('should return public teacher data', async () => {
    const { makeTeacherView } = buildTestContext();
    expect(await makeTeacherView(teacher)).to.eql(omit(teacher, 'phoneNumber'));
  });

  context('on returnPrivateFields', () => {
    const returnPrivateFields = true;

    it('should return full teacher data', async () => {
      const { makeTeacherView } = buildTestContext();
      expect(await makeTeacherView(teacher, { returnPrivateFields })).to.eql(teacher);
    });
  });
});
