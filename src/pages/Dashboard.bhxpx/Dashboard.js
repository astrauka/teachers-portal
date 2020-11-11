import wixLocation from 'wix-location';
import { currentTeachersTasks, curatingTeachersProfile, curatingTeachersInfo } from 'backend/backend-api';

$w.onReady(async () => {
	await Promise.all([
		populateTasksRepeater($w),
		setupCuratingTeacher($w)
	])
});

async function populateTasksRepeater($w) {
	const tasks = await currentTeachersTasks();
	$w('#tasksRepeater').data = tasks;
	$w('#tasksRepeater').forEachItem(($task, task, index) => {
		const previousTask = tasks[index - 1] || { isCompleted: true };
		$task('#taskContainer').style.backgroundColor = task.isCompleted ? '#60bc57' : previousTask.isCompleted ? 'red' : 'grey';
		$task('#taskNumber').text = String(task.number);
		$task('#taskTitle').text = task.title;
		$task('#taskButton').label = task.isCompleted ? task.completedButtonText : task.buttonText;
		$task('#taskButton').link = task.link;
	})
}

async function setupCuratingTeacher($w) {
	const teacherProfile = await curatingTeachersProfile();
	if (teacherProfile) {
		$w('#curatingTeacherName').text = teacherProfile.fullName;
		$w('#curatingTeacherImage').src = teacherProfile.profileImage;
		$w('#curatingTeacherAskButton').onClick(() => {
			wixLocation.to(`mailto:${teacherProfile.email}?subject=MRY%3A%20Question`);
		})
		await $w('#curatingTeacherGroup').expand();
	}

}
