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
    level: { type: 'string', min: 3, max: 255 },
    status: { type: 'string', min: 3, max: 255 },
    mentor: { type: 'string', min: 3 },
    certificateExpirationDate: { type: 'date' },
    userId: { type: 'string', min: 3, optional: true },
};
export const validateTeachersInfo = buildValidator(teachersInfoSchema);
