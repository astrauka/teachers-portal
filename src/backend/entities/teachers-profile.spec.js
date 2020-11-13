import { buildTeachersProfile } from '../../test/builders/teachers-profile';
import { expect, getErrorOf } from '../../test/utils/expectations';
import { validateTeachersProfile } from './teachers-profile';
describe('validateTeachersProfile', () => {
    const teachersProfile = buildTeachersProfile();
    it('should return teachers profile', () => {
        expect(validateTeachersProfile(teachersProfile)).to.eql(teachersProfile);
    });
    context('on invalid input', () => {
        const teachersProfile = buildTeachersProfile({
            properties: { email: 'email' },
            without: ['profileImage'],
        });
        it('should throw', () => {
            const errorMessage = getErrorOf(() => validateTeachersProfile(teachersProfile)).message;
            expect(errorMessage).to.include('field must be a valid e-mail');
            expect(errorMessage).to.include("The 'profileImage' field is required");
        });
    });
});
