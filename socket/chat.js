export default function chat (io){
    io.on('connection', (socket) => {
        socket.on('chat', (data) => {
          io.emit('chat',data);
        });
      });
}