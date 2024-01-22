export default function chat (io){
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
          io.emit('chat message', msg);
        })
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
      });
}