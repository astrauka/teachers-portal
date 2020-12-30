import { TaskStatus, TaskView } from 'public/common/entities/task';
import { forCurrentTeacher } from 'public/for-current-teacher';
import { getCuratingTeacher, getTasks } from 'public/global-state';
import wixLocation from 'wix-location';

const TASK_STATUS_COLORS = {
  [TaskStatus.completed]: '#60bc57',
  [TaskStatus.current]: 'red',
  [TaskStatus.upcoming]: 'grey',
};

forCurrentTeacher(async () => {
  await Promise.all([populateTasksRepeater(), setupCuratingTeacher()]);
});

async function populateTasksRepeater() {
  const tasks = await getTasks();
  const $tasksRepeater = $w('#tasksRepeater' as 'Repeater');
  $tasksRepeater.data = tasks;
  $tasksRepeater.forEachItem(($task, task: TaskView, index) => {
    const previousTask = tasks[index - 1] || { isCompleted: true };
    const status = task.isCompleted
      ? TaskStatus.completed
      : previousTask.isCompleted
      ? TaskStatus.current
      : TaskStatus.upcoming;
    $task('#taskContainer' as 'Box').style.backgroundColor = TASK_STATUS_COLORS[status];
    $task('#taskNumber' as 'Text').text = String(task.number);
    $task('#taskTitle' as 'Text').text = task.title;
    const $taskButton = $task('#taskButton' as 'Button');
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
    $w('#curatingTeacherName' as 'Text').text = curatingTeacher.fullName;
    $w('#curatingTeacherImage' as 'Image').src = curatingTeacher.profileImage;
    $w('#curatingTeacherAskButton' as 'Button').onClick(() => {
      wixLocation.to(`mailto:${curatingTeacher.email}?subject=MRY%3A%20Question`);
    });
    await $w('#curatingTeacherGroup' as 'Container').expand();
  }
}
