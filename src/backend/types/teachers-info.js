import { buildValidator } from '../utils/validate';
export var TeacherLevel;
(function (TeacherLevel) {
    TeacherLevel["NotATeacher"] = "Not a teacher";
    TeacherLevel["UtaraAhikari"] = "Utara Adhikari";
    TeacherLevel["Adhikari"] = "Adhikari";
    TeacherLevel["Basic2"] = "Basic II";
    TeacherLevel["Basic"] = "Basic";
})(TeacherLevel || (TeacherLevel = {}));
export var TeacherStatus;
(function (TeacherStatus) {
    TeacherStatus["Active"] = "Active";
    TeacherStatus["Suspended"] = "Suspended";
})(TeacherStatus || (TeacherStatus = {}));
const teachersInfoSchema = {
    _id: { type: 'string', min: 3, max: 255, optional: true },
    email: { type: 'email' },
    firstName: { type: 'string', min: 3, max: 255 },
    lastName: { type: 'string', min: 3, max: 255 },
    levelId: { type: 'string', min: 3, max: 255 },
    statusId: { type: 'string', min: 3, max: 255 },
    mentorId: { type: 'string', min: 3, optional: true },
    certificateExpirationDate: { type: 'date', optional: true },
    userId: { type: 'string', min: 3, optional: true },
};
export const validateTeachersInfo = buildValidator(teachersInfoSchema);
