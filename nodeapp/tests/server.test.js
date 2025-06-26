const request = require('supertest');
const http = require('http');
const chatApp = require('../index'); // Adjust this path as needed

let server;

beforeAll((done) => {
  server = http.createServer((req, res) => {
    chatApp.handleRequest(req, res);
  }).listen(4000, done); // Start server on port 4000 for testing
});

afterAll((done) => {
  server.close(done); // Close the server after all tests
});

describe('Chat App', () => {
  beforeEach(() => {
    chatApp.messages = [];
  });

  test('sendMessage_is_working', () => {
    const message = chatApp.sendMessage('User', 'Hello!');
    expect(chatApp.messages.length).toBe(1);
    expect(chatApp.messages[0]).toEqual(message);
  });

  test('listMessages_is_working', () => {
    chatApp.sendMessage('User1', 'Message 1');
    chatApp.sendMessage('User2', 'Message 2');
    const messages = chatApp.listMessages();
    expect(messages.length).toBe(2);
    expect(messages[0].username).toBe('User1');
  });

  test('handleRequest_sendMessage_is_working', async () => {
    const response = await request(server)
      .post('/send-message')
      .send({ username: 'User', message: 'Test message' });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('User');
  });

  test('handleRequest_listMessages_is_working', async () => {
    await request(server).post('/send-message').send({ username: 'User1', message: 'Message 1' });
    await request(server).post('/send-message').send({ username: 'User2', message: 'Message 2' });
    const response = await request(server).get('/messages');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].username).toBe('User1');
  });

  test('sendMessage_withInvalidData_returnsError', async () => {
    const response = await request(server)
      .post('/send-message')
      .send({ username: 'User' }); // Missing message
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid input data');
  });

  test('handleRequest_invalidEndpoint_returns404', async () => {
    const response = await request(server).get('/invalid-endpoint');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });

  test('handleRequest_sendMessage_withEmptyBody_returnsError', async () => {
    const response = await request(server)
      .post('/send-message')
      .send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid input data');
  });

  test('handleRequest_sendMessage_withNonStringUsername_returnsError', async () => {
    const response = await request(server)
      .post('/send-message')
      .send({ username: 123, message: 'Test message' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid input data');
  });

  test('handleRequest_sendMessage_withNonStringMessage_returnsError', async () => {
    const response = await request(server)
      .post('/send-message')
      .send({ username: 'User', message: 123 });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid input data');
  });

  test('handleRequest_sendMessage_withInvalidMethod_returnsError', async () => {
    const response = await request(server)
      .get('/send-message')
      .send({ username: 'User', message: 'Test message' });
    expect(response.status).toBe(404);
  });
});
