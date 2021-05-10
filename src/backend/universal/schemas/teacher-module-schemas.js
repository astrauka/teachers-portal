export const teacherModuleSchema = {
    _id: { type: 'string', min: 3, max: 255, optional: true },
    module: { type: 'string', min: 3, optional: true },
    teacherId: { type: 'string', min: 3, max: 255 },
    moduleId: { type: 'string', min: 3, max: 255 },
    certificateExpirationDate: { type: 'date', optional: true },
};
