import { getTasks, refreshTasks, setCurrentTeacher } from './global-state';
export async function onTeacherUpdated(teacher) {
    setCurrentTeacher(teacher);
    await refreshTasks();
    await updateHeaderNotificationsCount();
}
export async function updateHeaderNotificationsCount() {
    const $headerNotificationsButton = $w('#headerNotificationsButton');
    const tasks = await getTasks();
    const incompleteTasksCount = tasks.filter((task) => !task.isCompleted).length;
    if (incompleteTasksCount) {
        $headerNotificationsButton.label = String(incompleteTasksCount);
        $headerNotificationsButton.show();
    }
    else {
        $headerNotificationsButton.hide();
    }
}
