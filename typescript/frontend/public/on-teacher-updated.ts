import { TeacherView } from './common/entities/teacher';
import { getTasks, refreshTasks, setCurrentTeacher } from './global-state';

export async function onTeacherUpdated(teacher: TeacherView) {
  setCurrentTeacher(teacher);
  await refreshTasks();
  await updateHeaderNotificationsCount();
}

export async function updateHeaderNotificationsCount() {
  const $headerNotificationsButton = $w('#headerNotificationsButton' as 'Button');
  const tasks = await getTasks();
  const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
  if (incompleteTasksCount) {
    $headerNotificationsButton.label = String(incompleteTasksCount);
    $headerNotificationsButton.show();
  } else {
    $headerNotificationsButton.hide();
  }
}
