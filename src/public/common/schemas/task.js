export const taskSchema = {
    _id: { type: 'string', min: 3, max: 255, optional: true },
    number: { type: 'number', min: 1 },
    title: { type: 'string', min: 1 },
    buttonText: { type: 'string', min: 1 },
    completedButtonText: { type: 'string', min: 1 },
    link: { type: 'string', min: 1 },
};
