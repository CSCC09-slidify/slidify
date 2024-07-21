export const sendNotification = (actorId, socket, notification) => {
    socket.emit(`notification/${actorId}/new`, {
        type: notification.type,
        content: notification.content,
        date: Date.now()
    });
}