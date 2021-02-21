import { last } from 'lodash';
export function normalizeSecondStepTeacherFormInput(field, value) {
    switch (field) {
        case 'facebook':
            return getSocialLinkUsername(value, 'facebook.com/');
        case 'instagram':
            return getSocialLinkUsername(value, 'instagram.com/');
        case 'linkedIn':
            return getSocialLinkUsername(value, 'linkedin.com/in/');
        default:
            return value;
    }
}
function getSocialLinkUsername(linkOrUsername, separator) {
    return linkOrUsername ? last(linkOrUsername.split(separator)) : undefined;
}
