
// const chatApp = {
//     messages: [], // Array to store chat messages

//     /**
//      * Creates and stores a new message.
//      * @param {string} username - The username of the sender.
//      * @param {string} message - The content of the message.
//      * @returns {object} The created message object.
//      */
//     sendMessage: (username, message) => {
//         // Basic validation for sendMessage function itself
//         if (typeof username !== 'string' || username.trim() === '' ||
//             typeof message !== 'string' || message.trim() === '') {
//             // In a real app, you might throw an error or return a specific status
//             // For this test, the handleRequest will catch invalid data
//             return null;
//         }

//         const newMessage = {
//             id: Date.now(), // Unique ID for the message
//             username: username,
//             message: message,
//             timestamp: new Date().toISOString() // ISO format timestamp
//         };
//         chatApp.messages.push(newMessage);
//         return newMessage;
//     },

//     /**
//      * Returns the list of all stored messages.
//      * @returns {Array<object>} An array of message objects.
//      */
//     listMessages: () => {
//         return chatApp.messages;
//     },

//     /**
//      * Handles incoming HTTP requests for the chat application.
//      * This function acts as a simple router and request body parser.
//      * @param {http.IncomingMessage} req - The incoming request object.
//      * @param {http.ServerResponse} res - The server response object.
//      */
//     handleRequest: (req, res) => {
//         const { url, method } = req;

//         // Helper function to send JSON response
//         const sendJsonResponse = (statusCode, data) => {
//             res.writeHead(statusCode, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(data));
//         };

//         // Helper function to send plain text error response
//         const sendErrorResponse = (statusCode, message) => {
//             res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
//             res.end(message);
//         };

//         // Handle POST requests
//         if (method === 'POST') {
//             if (url === '/send-message') {
//                 let body = '';
//                 req.on('data', chunk => {
//                     body += chunk.toString(); // Accumulate data chunks
//                 });
//                 req.on('end', () => {
//                     try {
//                         const { username, message } = JSON.parse(body);

//                         // Validate input data types and presence
//                         if (typeof username !== 'string' || username.trim() === '' ||
//                             typeof message !== 'string' || message.trim() === '') {
//                             return sendErrorResponse(400, 'Invalid input data');
//                         }

//                         const newMessage = chatApp.sendMessage(username, message);
//                         if (newMessage) {
//                             return sendJsonResponse(200, newMessage);
//                         } else {
//                             // This case should ideally be caught by the validation above,
//                             // but as a fallback.
//                             return sendErrorResponse(400, 'Failed to send message');
//                         }
//                     } catch (error) {
//                         // Handle JSON parsing errors or other unexpected errors
//                         return sendErrorResponse(400, 'Invalid input data');
//                     }
//                 });
//             } else {
//                 // Handle unknown POST endpoints
//                 sendErrorResponse(404, 'Not Found');
//             }
//         }
//         // Handle GET requests
//         else if (method === 'GET') {
//             if (url === '/messages') {
//                 const messages = chatApp.listMessages();
//                 sendJsonResponse(200, messages);
//             } else {
//                 // Handle unknown GET endpoints
//                 sendErrorResponse(404, 'Not Found');
//             }
//         }
//         // Handle other HTTP methods (PUT, DELETE, etc.)
//         else {
//             sendErrorResponse(404, 'Not Found');
//         }
//     }
// };

// module.exports = chatApp; // Export the chatApp object
