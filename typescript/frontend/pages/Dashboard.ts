import { curatingTeachersProfile, currentTeachersTasks } from 'backend/backend-api';
import { forLoggedInUser } from 'public/for-logged-in-user';
import wixLocation from 'wix-location';

$w.onReady(() =>
  forLoggedInUser(async () => {
    await Promise.all([populateTasksRepeater($w), setupCuratingTeacher($w)]);
  })
);

async function populateTasksRepeater($w) {
  const tasks = await currentTeachersTasks();
  const $tasksRepeater = $w('#tasksRepeater' as 'Repeater');
  $tasksRepeater.data = tasks;
  $tasksRepeater.forEachItem(($task, task, index) => {
    const previousTask = tasks[index - 1] || { isCompleted: true };
    $task('#taskContainer' as 'Box').style.backgroundColor = task.isCompleted
      ? '#60bc57'
      : previousTask.isCompleted
      ? 'red'
      : 'grey';
    $task('#taskNumber' as 'Text').text = String(task.number);
    $task('#taskTitle' as 'Text').text = task.title;
    const $taskButton = $task('#taskButton' as 'Button');
    $taskButton.label = task.isCompleted ? task.completedButtonText : task.buttonText;
    $taskButton.link = task.link;
  });
}

async function setupCuratingTeacher($w) {
  const teacherProfile = await curatingTeachersProfile();
  if (teacherProfile) {
    $w('#curatingTeacherName' as 'Text').text = teacherProfile.fullName;
    $w('#curatingTeacherImage' as 'Image').src = teacherProfile.profileImage;
    $w('#curatingTeacherAskButton' as 'Button').onClick(() => {
      wixLocation.to(`mailto:${teacherProfile.email}?subject=MRY%3A%20Question`);
    });
    await $w('#curatingTeacherGroup' as 'Container').expand();
  }
}
