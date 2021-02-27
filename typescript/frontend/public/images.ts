const IMAGE_ROOT = 'https://static.wixstatic.com/media/';
export enum ImageDefault {
  Profile = '7961b2_ff09425c2c5c4394aaa6dce5a50837f1~mv2.png/v1/fit/w_924,h_520/7961b2_ff09425c2c5c4394aaa6dce5a50837f1~mv2.png',
}

export function setImageDefault(
  currentImage: string,
  $image: $w.Image,
  defaultImage: ImageDefault
) {
  if (!currentImage) {
    $image.src = `${IMAGE_ROOT}${defaultImage}`;
  }
}
