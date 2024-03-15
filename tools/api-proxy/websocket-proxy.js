/**
 * This script is a simple WebSocket Echo server which works as a Cloudflare Worker.
 * It listens for incoming WebSocket connections and echoes back any received messages.
 * The server logs each received message to the console.
 * The server responds to each message with the current timestamp.
 * @param {Request} request
 */
async function handleRequest(request) {
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  // eslint-disable-next-line no-undef
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();

  server.addEventListener('message', (event) => {
    console.log(event.data); // Log the received message
    // Respond with the current timestamp
    const currentTime = new Date().toLocaleString(); // Human-readable timestamp
    server.send(`Message received; current timestamp is: ${currentTime}`);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export default {
  fetch: handleRequest,
};
