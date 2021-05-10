import { TeacherWix } from 'public/universal/entities/teacher';
import wixLocation from 'wix-location';
import { ImageDefault, setImageDefault } from './images';

export function addTeacherLoadedHandler() {
  $w('#teachersRepeater' as 'Repeater').onItemReady(($item, teacher: TeacherWix) => {
    const $profileImage = $item('#teachersProfileImage' as 'Image');
    setImageDefault(teacher.profileImage, $profileImage, ImageDefault.Profile);
    $profileImage.onClick(() => redirectToTeacher(teacher));
    $item('#teachersName' as 'Text').onClick(() => redirectToTeacher(teacher));
  });
}

export function redirectToTeacher(teacher: TeacherWix) {
  const { slug } = teacher;
  wixLocation.to(`/teacher/${slug}`);
}
