import wixUsers from 'wix-users';
export function forLoggedInUser(forLoggedInFn) {
    const currentUser = wixUsers.currentUser;
    if (currentUser.loggedIn) {
        return forLoggedInFn();
    }
}
