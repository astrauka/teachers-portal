import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import { Tasks, TaskStatus } from 'public/universal/entities/teacher';
import wixLocation from 'wix-location';
const TASK_STATUS_COLORS = {
    [TaskStatus.completed]: '#F0F1F1',
    [TaskStatus.current]: 'red',
};
forCurrentTeacher('dashboard', async ({ teacher }) => {
    populateTasksRepeater(teacher);
    await setupCuratingTeacher();
});
function populateTasksRepeater(teacher) {
    const $tasksRepeater = $w('#tasksRepeater');
    $tasksRepeater.forEachItem(($task, _item, index) => {
        const status = teacher.completedTasks.includes(Tasks[index])
            ? TaskStatus.completed
            : index === 0 || teacher.completedTasks.includes(Tasks[index - 1])
                ? TaskStatus.current
                : TaskStatus.upcoming;
        const color = TASK_STATUS_COLORS[status];
        if (color) {
            $task('#taskContainer').style.backgroundColor = TASK_STATUS_COLORS[status];
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
        $w('#curatingTeacherGroup').expand();
    }
}
