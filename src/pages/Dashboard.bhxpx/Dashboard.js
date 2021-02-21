import { Tasks, TaskStatus } from 'public/common/entities/teacher';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import wixLocation from 'wix-location';
const TASK_STATUS_COLORS = {
    [TaskStatus.completed]: '#60bc57',
    [TaskStatus.current]: 'red',
    [TaskStatus.upcoming]: 'grey',
};
forCurrentTeacher(async ({ teacher }) => {
    await Promise.all([populateTasksRepeater(teacher), setupCuratingTeacher()]);
});
async function populateTasksRepeater(teacher) {
    const $tasksRepeater = $w('#tasksRepeater');
    $tasksRepeater.forEachItem(($task, _item, index) => {
        const status = teacher.completedTasks.includes(Tasks[index])
            ? TaskStatus.completed
            : teacher.completedTasks.includes(Tasks[index - 1])
                ? TaskStatus.current
                : TaskStatus.upcoming;
        $task('#taskContainer').style.backgroundColor = TASK_STATUS_COLORS[status];
    });
}
async function setupCuratingTeacher() {
    const curatingTeacher = await getCuratingTeacher();
    if (curatingTeacher) {
        $w('#curatingTeacherName').text = curatingTeacher.fullName;
        $w('#curatingTeacherImage').src = curatingTeacher.profileImage;
        $w('#curatingTeacherAskButton').onClick(() => {
            wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
        });
        $w('#curatingTeacherGroup').expand();
    }
}
