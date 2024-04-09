import {

} from './httpRequests';


beforeEach(() => {
    requestClear();
  });


// have to download moment for unix?

import moment from 'moment';

// Function to format Unix timestamp to a readable date/time string
function formatUnixTime(timestamp: number): string {
  return moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");

  // or ?

  Date.now()
}

// playerChatSession
// Goal: Display all chat messages in session

describe('Return all messages in chat', () => {
    const playerid = playerID('5546');
    const playerMessages = messages.filter(message => message.playerId === playerId);
    playerMessages.forEach(message => {
      console.log(`Message: ${message.messageBody}`);
      console.log(`Time Sent: ${formatUnixTime(message.timeSent)}`);
    });
})

  test('Player ID does not exist', () => {
    const playerid = playerID('5546');
    expect(playerChatSession(playerid + 1)).toStrictEqual({ error: expect.any(String) });
    //return nothing?
  });


// playerChatSend
// Goal: Send a message into chat
describe('Sent a message into chat', () => {
  test('Message sent successfully', () => {
    const playerid = '5546'; 
    expect(message)
});
});

test('Player ID does not exist', () => {
  const playerid = playerID('5546');
  expect(playerChatSession(playerid + 1)).toStrictEqual({ error: expect.any(String) });
});


test('Message body is greater than 100 characters', () => {
  const playerid = playerID('5546');
  expect(todo(

    `How much wood can a wood chucker chuck wood? I don't actually know 
    but that was a great character count filler.`
  )).toStrictEqual({ error: expect.any(String) });
});

test('Message body is lesser than 1 character', () => {
  const playerid = playerID('5546');
  expect(todo(``)).toStrictEqual({ error: expect.any(String) });
});





