function connectWebSocket(block) {
  const wsUrl = 'wss://temp.franklin-prod.workers.dev';
  const websocket = new WebSocket(wsUrl);

  // eslint-disable-next-line no-unused-vars
  websocket.addEventListener('open', (event) => {
    block.textContent = 'Connected to the WebSocket server';

    // console.log('Connected to the WebSocket server');

    // Send a message every second
    setInterval(() => {
      websocket.send('Requesting timestamp');
    }, 1000);
  });

  websocket.addEventListener('message', (event) => {
    block.textContent = `${event.data.replace('Message received; current', 'Current')}`;
    //  console.log('Message from server:', event.data);
  });

  websocket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed, attempting to reconnect...');
    setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
  });

  websocket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });
}

export default function decorate(block) {
  connectWebSocket(block);
}
