import { Notification } from '@application/entities/notification';

export class NotificationViewModel {
  // método associado à classe, não a um objeto da classe. Não precisa instânciar
  // recebe o objeto no formato original (camada de aplicação) e converte para o formato de HTTP response
  static toHTTP(notification: Notification) {
    return {
      id: notification.id,
      recipientId: notification.recipientId,
      category: notification.category,
      content: notification.content.value,
    };
  }
}
