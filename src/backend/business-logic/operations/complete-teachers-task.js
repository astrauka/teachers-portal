export function completeTeachersTaskFactory(getTeacher, teachersRepository, tasksRepository) {
    return async function completeTeachersTask(taskNumber) {
        const teacher = await getTeacher();
        const task = await tasksRepository.fetchTaskByNumberOrThrow(taskNumber);
        const completedTasks = await teachersRepository.fetchCompletedTasks(teacher);
        if (completedTasks.find((completedTask) => completedTask.number === taskNumber)) {
            return;
        }
        else {
            return teachersRepository.completeTask(teacher, task);
        }
    };
}
