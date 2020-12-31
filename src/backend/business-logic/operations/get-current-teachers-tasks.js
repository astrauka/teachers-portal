import { keyBy } from 'lodash';
export function getTeachersTasksFactory(tasksRepository, teachersRepository, getTeacher) {
    return async function getTeachersTasks() {
        const [tasks, teacher] = await Promise.all([tasksRepository.fetchAllTasks(), getTeacher()]);
        const completedTasks = keyBy(await teachersRepository.fetchCompletedTasks(teacher), '_id');
        return tasks.map((task) => ({ ...task, isCompleted: Boolean(completedTasks[task._id]) }));
    };
}
