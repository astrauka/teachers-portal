import wixUsers from 'wix-users';

export function forLoggedInUser(forLoggedInFn: () => void) {
  const currentUser = wixUsers.currentUser;
  if (currentUser.loggedIn) {
    return forLoggedInFn();
  }
}
