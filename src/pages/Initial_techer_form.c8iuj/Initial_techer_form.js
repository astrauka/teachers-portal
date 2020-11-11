import wixUsers from 'wix-users';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { currentTeachersProfile, currentTeachersInfo, updateTeachersProfile } from 'backend/backend-api';

let isProfileImageUploadedByUser;

$w.onReady(async function () {
	await setCurrentTeacherName($w);
	await assignCurrentTeacherProfileFormFields($w);
	$w('#submit').onClick(() => submitProfileInfoForm($w));
});

async function assignCurrentTeacherProfileFormFields($w) {
	const teachersProfile = await currentTeachersProfile();
	if (teachersProfile) {
		isProfileImageUploadedByUser = true;
		$w('#profileImage').src = teachersProfile.profileImage;
		$w('#phoneNumber').value = teachersProfile.phoneNumber;
		$w('#country').value = teachersProfile.country;
		$w('#city').value = teachersProfile.city;
		$w('#streetAddress').value = teachersProfile.streetAddress;
		$w('#language').value = teachersProfile.language;
	} else {
		isProfileImageUploadedByUser = false
		console.info(`Teachers profile not found for ${await wixUsers.currentUser.getEmail()}`);
	}
}

async function setCurrentTeacherName($w) {
	const teachersInfo = await currentTeachersInfo();
	if (teachersInfo) {
		$w('#teacherFullName').text = `${teachersInfo.firstName} ${teachersInfo.lastName}`;
	} else {
		console.error(`Could not load current teacher for ${await wixUsers.currentUser.getEmail()}`);
	}
}

export function uploadButton_change(event) {
	if ($w("#uploadButton").value.length > 0) {
		const previousButtonLabel = $w("#uploadButton").buttonLabel;
		$w("#uploadButton").buttonLabel = 'Uploading...';
		$w("#uploadStatus").text = `Uploading ${$w("#uploadButton").value[0].name}`;

		$w("#uploadButton").startUpload()
			.then((uploadedFile) => {
				$w("#uploadStatus").text = "Upload successful";
				$w("#profileImage").src = uploadedFile.url;
				isProfileImageUploadedByUser = true;
			})
			.catch((uploadError) => {
				$w("#uploadStatus").text = "File upload error";
				console.error(`Error: ${uploadError.errorCode}`);
				console.error(uploadError.errorDescription);
			})
			.finally(() => {
				$w("#uploadButton").buttonLabel = previousButtonLabel;
			});
	} else {
		$w("#uploadStatus").text = "Please choose a file to upload.";
	}
}

export async function submitProfileInfoForm($w) {
	$w('#submissionStatus').text = "Submitting ...";
	$w('#submissionStatus').show();
	const profileImage = isProfileImageUploadedByUser ? $w('#profileImage').src : '';

	try {
		const update = {
			profileImage,
			phoneNumber: $w('#phoneNumber').value,
			country: $w('#country').value,
			city: $w('#city').value,
			streetAddress: $w('#streetAddress').value,
			language: $w('#language').value,
		};
		await updateTeachersProfile(update);
		$w('#submissionStatus').text = "Profile updated.";
		$w('#submissionStatus').hide("fade", { "duration": 2000, "delay": 1000 });
		if (profileImage) {
			$w('#headerProfileImage').src = profileImage;
		}
		wixLocation.to('/dashboard');

	} catch (error) {
		$w('#submissionStatus').text = `Update failed: ${error.message}`;
	}

}
