export class NotificationNotFound extends Error {
  constructor() {
    // chama o construtor do Error
    super('Notification not found.');
  }
}
