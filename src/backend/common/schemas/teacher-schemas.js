import { chain, omit } from 'lodash';
import { Tasks, } from '../entities/teacher';
export const adminFilledInformationSchema = {
    _id: { type: 'string', min: 3, max: 255, optional: true },
    email: { type: 'email', trim: true },
    firstName: { type: 'string', min: 3, max: 255, trim: true },
    lastName: { type: 'string', min: 3, max: 255, trim: true },
    levelId: { type: 'string', min: 3, max: 255 },
    statusId: { type: 'string', min: 3, max: 255 },
    mentorId: { type: 'string', min: 3, optional: true },
    certificateExpirationDate: { type: 'date', optional: true },
    certificateNumber: { type: 'string', min: 3, optional: true, trim: true },
    modules: { type: 'string', min: 3, optional: true },
    streetAddress: { type: 'string', trim: true, optional: true },
    siteMemberId: { type: 'string', min: 3, optional: true },
};
export const initialTeachersFormSchema = {
    profileImage: { type: 'string', empty: false },
    phoneNumber: { type: 'string', min: 3, max: 255, pattern: /^\+?[\d\-\s]+$/, trim: true },
    city: { type: 'string', min: 3, max: 255, trim: true },
    country: { type: 'string', empty: false },
    language: { type: 'string', empty: false },
};
export const initialFormFilledInformationSchema = {
    ...chain(initialTeachersFormSchema)
        .omit(['country', 'language'])
        .transform((acc, definition, key) => {
        acc[key] = { ...omit(definition, 'min'), empty: true };
    }, {})
        .value(),
    countryId: { type: 'string', min: 3, max: 255, optional: true },
    languageId: { type: 'string', min: 3, max: 255, optional: true },
};
export const secondStepTeachersFormSchema = {
    facebook: {
        type: 'string',
        empty: true,
        max: 300,
        pattern: /^([\w\-]*\/)*[\w\-.]*$/,
        trim: true,
    },
    instagram: {
        type: 'string',
        empty: true,
        max: 300,
        pattern: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        trim: true,
    },
    linkedIn: {
        type: 'string',
        empty: true,
        max: 300,
        pattern: /([^\/?&\s]*)(?:\/|&|\?)?.*$/,
        trim: true,
    },
    website: {
        type: 'url',
        empty: true,
        trim: true,
    },
    about: { type: 'string', empty: true, trim: true },
    photos: {
        type: 'array',
        items: {
            type: 'object',
            props: {
                type: { type: 'string' },
                slug: { type: 'string', optional: true },
                src: { type: 'string' },
                description: { type: 'string', optional: true },
                title: { type: 'string', optional: true },
                link: { type: 'string', optional: true },
                thumbnail: { type: 'string', optional: true },
            },
        },
    },
};
const computedTeacherInformationSchema = {
    fullName: { type: 'string', min: 3 },
    slug: { type: 'string', min: 3, optional: true },
    siteMemberId: { type: 'string', min: 3, optional: true },
    completedTasks: {
        type: 'array',
        items: 'string',
        enum: Tasks,
        unique: true,
        optional: true,
    },
};
export const teacherSchema = {
    ...adminFilledInformationSchema,
    ...computedTeacherInformationSchema,
    ...initialFormFilledInformationSchema,
    ...secondStepTeachersFormSchema,
};
