import { Tasks, TaskStatus, TeacherView } from 'public/common/entities/teacher';
import { forCurrentTeacher, InitialState } from 'public/for-current-teacher';
import { getCuratingTeacher } from 'public/global-state';
import wixLocation from 'wix-location';

const TASK_STATUS_COLORS = {
  [TaskStatus.completed]: '#60bc57',
  [TaskStatus.current]: 'red',
  [TaskStatus.upcoming]: 'grey',
};

forCurrentTeacher('dashboard', async ({ teacher }: InitialState) => {
  populateTasksRepeater(teacher);
  await setupCuratingTeacher();
});

function populateTasksRepeater(teacher: TeacherView) {
  const $tasksRepeater = $w('#tasksRepeater' as 'Repeater');
  $tasksRepeater.forEachItem(($task, _item, index) => {
    const status = teacher.completedTasks.includes(Tasks[index])
      ? TaskStatus.completed
      : teacher.completedTasks.includes(Tasks[index - 1])
      ? TaskStatus.current
      : TaskStatus.upcoming;
    $task('#taskContainer' as 'Box').style.backgroundColor = TASK_STATUS_COLORS[status];
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
    $w('#curatingTeacherGroup' as 'Container').expand();
  }
}
