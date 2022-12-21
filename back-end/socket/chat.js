module.exports = function (io) {

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`);
    io.emit('connection')
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('message', (msg) => {
      let txt = msg.text;
      let sender = msg.sender;
        console.log(`Message reçu: ${txt} de ${sender}`);
        io.emit('message', msg)
    });
  })
}