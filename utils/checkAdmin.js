export function checkAdmin(currentUser) {
  if (!currentUser || !currentUser.isAdmin) {
    throw new Error('You do not have permission to perform this action.');
  }
}