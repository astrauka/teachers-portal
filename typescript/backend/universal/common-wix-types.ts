// Cannot take types from Corvid definitions because backend and frontend types clash, redefining manually
// export import ImageItem = $w.Gallery.ImageItem;
// export import VideoItem = $w.Gallery.VideoItem;
export interface ImageItem {
  type: string;
  slug?: string;
  src: string;
  description?: string;
  title?: string;
  link?: string;
}

export interface VideoItem {
  type: string;
  slug?: string;
  src: string;
  description?: string;
  title?: string;
  link?: string;
  thumbnail?: string;
}

export enum MediaItemTypes {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum RegistrationResultStatus {
  Pending = 'Pending',
  Active = 'Active',
}

export enum MemberStatus {
  Applicant = 'APPLICANT',
  Active = 'ACTIVE',
  Blocked = 'BLOCKED',
}
