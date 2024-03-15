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

  const niftyValues = [10000, 10100, 10200, 10300, 10400, 10500, 10600, 10700, 10800, 10900];
  const sensexValues = [35000, 35200, 35400, 35600, 35800, 36000, 36200, 36400, 36600, 36800];

  // Counter to track the current index of the values to send
  let currentIndex = 0;

  server.addEventListener('message', () => {
    // Get the current Nifty and Sensex values
    const currentNifty = niftyValues[currentIndex];
    const currentSensex = sensexValues[currentIndex];

    // Prepare the response data
    const responseData = {
      nifty: currentNifty,
      sensex: currentSensex,
    };

    // Send the data as a JSON string
    server.send(JSON.stringify(responseData));

    // Increment the index, reset if it reaches the end of the array
    currentIndex = (currentIndex + 1) % niftyValues.length;
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export default {
  fetch: handleRequest,
};
