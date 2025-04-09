export class NotificationIsCanceled extends Error {
  constructor() {
    super('Notification is canceled.');
  }
}
