export class NotificationNotReadYet extends Error {
  constructor() {
    super('Notification not read yet.');
  }
}
