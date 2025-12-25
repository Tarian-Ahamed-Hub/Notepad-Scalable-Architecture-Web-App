 
function setupSocketEvents(io) {
  console.log('Setting up Socket.IO event handlers...');
  
  io.on('connection', (socket) => {
    const clientId = socket.id;
    console.log(`Client connected: ${clientId}`);
    
  });
  
  console.log('Socket.IO event handlers ready');
}

module.exports = { setupSocketEvents };