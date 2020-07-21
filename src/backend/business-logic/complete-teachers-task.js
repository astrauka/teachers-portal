export function completeTeachersTaskFactory(getCurrentTeachersInfo, teachersInfoRepository, taskRepository) {
    return async function completeTeachersTask(taskNumber) {
        const teachersInfo = await getCurrentTeachersInfo();
        const task = await taskRepository.fetchTaskByNumberSafe(taskNumber);
        const completedTasks = await teachersInfoRepository.fetchCompletedTasks(teachersInfo);
        if (completedTasks.find((completedTask) => completedTask.number === taskNumber)) {
            return;
        }
        else {
            return teachersInfoRepository.completeTask(teachersInfo, task);
        }
    };
}
