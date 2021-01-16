import { TaskStatus } from 'public/common/entities/task';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import wixLocation from 'wix-location';
const TASK_STATUS_COLORS = {
    [TaskStatus.completed]: '#60bc57',
    [TaskStatus.current]: 'red',
    [TaskStatus.upcoming]: 'grey',
};
forCurrentTeacher(async ({ tasks }) => {
    await Promise.all([populateTasksRepeater(tasks), setupCuratingTeacher()]);
});
async function populateTasksRepeater(tasks) {
    const $tasksRepeater = $w('#tasksRepeater');
    $tasksRepeater.data = tasks;
    $tasksRepeater.forEachItem(($task, task, index) => {
        const previousTask = tasks[index - 1] || { isCompleted: true };
        const status = task.isCompleted
            ? TaskStatus.completed
            : previousTask.isCompleted
                ? TaskStatus.current
                : TaskStatus.upcoming;
        $task('#taskContainer').style.backgroundColor = TASK_STATUS_COLORS[status];
        $task('#taskNumber').text = String(task.number);
        $task('#taskTitle').text = task.title;
        const $taskButton = $task('#taskButton');
        $taskButton.label = task.isCompleted ? task.completedButtonText : task.buttonText;
        $taskButton.link = task.link;
        if (status === TaskStatus.upcoming) {
            $taskButton.hide();
        }
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
        await $w('#curatingTeacherGroup').expand();
    }
}
