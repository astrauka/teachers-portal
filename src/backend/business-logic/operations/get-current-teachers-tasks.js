import { keyBy } from 'lodash';
export function getCurrentTeachersTasksFactory(taskRepository, teachersInfoRepository, getCurrentTeachersInfo) {
    return async function getCurrentTeachersTasks() {
        const [tasks, teachersInfo] = await Promise.all([
            taskRepository.fetchAllTasks(),
            getCurrentTeachersInfo(),
        ]);
        const completedTasks = keyBy(await teachersInfoRepository.fetchCompletedTasks(teachersInfo), '_id');
        return tasks.map((task) => ({ ...task, isCompleted: Boolean(completedTasks[task._id]) }));
    };
}
