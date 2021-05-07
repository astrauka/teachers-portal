export const TEACHER_PUBLIC_FIELDS = [
    '_id',
    'email',
    'firstName',
    'lastName',
    'levelId',
    'statusId',
    'mentorId',
    'certificateExpirationDate',
    'certificateNumber',
    'countryId',
    'languageId',
    'city',
    'fullName',
    'slug',
    'completedTasks',
    'modules',
    'profileImage',
    'facebook',
    'instagram',
    'linkedIn',
    'website',
    'about',
    'photos',
];
export const TEACHER_ALL_FIELDS = [...TEACHER_PUBLIC_FIELDS, 'phoneNumber'];
export const TEACHER_DEFAULTS = {
    slug: null,
    mentorId: null,
    certificateExpirationDate: null,
    profileImage: '',
    phoneNumber: '',
    countryId: null,
    city: '',
    modules: '',
    languageId: null,
    facebook: '',
    instagram: '',
    linkedIn: '',
    website: '',
    about: '',
    photos: [],
    completedTasks: [],
};
export var TeacherLevels;
(function (TeacherLevels) {
    TeacherLevels["UtaraAhikari"] = "Utara Adhikari";
    TeacherLevels["Adhikari"] = "Adhikari";
    TeacherLevels["Basic2"] = "Basic II";
    TeacherLevels["Basic"] = "Basic";
})(TeacherLevels || (TeacherLevels = {}));
export var AccountStatuses;
(function (AccountStatuses) {
    AccountStatuses["Active"] = "Active";
    AccountStatuses["Inactive"] = "Inactive";
    AccountStatuses["NotATeacher"] = "Not a teacher";
})(AccountStatuses || (AccountStatuses = {}));
export var TaskName;
(function (TaskName) {
    TaskName["initialProfileForm"] = "initialProfileForm";
    TaskName["secondStepProfileForm"] = "secondStepProfileForm";
})(TaskName || (TaskName = {}));
export const Tasks = [TaskName.initialProfileForm, TaskName.secondStepProfileForm];
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["completed"] = "completed";
    TaskStatus["current"] = "current";
    TaskStatus["upcoming"] = "upcoming";
})(TaskStatus || (TaskStatus = {}));
