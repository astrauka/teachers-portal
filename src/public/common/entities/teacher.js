export const PRIVATE_TEACHER_FIELDS = ['phoneNumber'];
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
