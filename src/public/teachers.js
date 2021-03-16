import wixLocation from 'wix-location';
import { ImageDefault, setImageDefault } from './images';
export function addTeacherLoadedHandler() {
    $w('#teachersRepeater').onItemReady(($item, teacher) => {
        const $profileImage = $item('#teachersProfileImage');
        setImageDefault(teacher.profileImage, $profileImage, ImageDefault.Profile);
        $profileImage.onClick(() => redirectToTeacher(teacher));
        $item('#teachersName').onClick(() => redirectToTeacher(teacher));
    });
}
export function redirectToTeacher(teacher) {
    const { slug } = teacher;
    wixLocation.to(`/teacher/${slug}`);
}
