import { ok } from 'wix-http-functions';
import { context } from './context/setup-context';
import { withLogger } from './utils/logger';
import { ensureTestUserTokenCorrect, getResponse, withRouteErrorHandler } from './utils/request';
export function post_teachers_invite(request) {
    return withRouteErrorHandler(async () => {
        await ensureTestUserTokenCorrect(request);
        const { actions } = context;
        return withLogger('post_teachers_invite', async () => {
            await actions.cleanTestTeacher();
            const teacher = await actions.createTestTeacher();
            return ok(getResponse({ body: { teacher } }));
        });
    });
}
export function post_teachers_cleanFields(request) {
    return withRouteErrorHandler(async () => {
        await ensureTestUserTokenCorrect(request);
        return withLogger('post_teachers_cleanFields', async () => {
            const teacher = await context.actions.cleanTestTeacherFields();
            return ok(getResponse({ body: { teacher } }));
        });
    });
}
