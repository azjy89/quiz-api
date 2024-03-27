import { 
  requestAuthRegister, 
  requestQuizList, 
  requestQuizCreate, 
  requestQuizRemove, 
  requestQuizInfo, 
  requestQuizNameUpdate, 
  requestQuizDescriptionUpdate, 
  requestQuizQuestionCreate, 
  requestQuizQuestionUpdate, 
  requestClear, 
  requestQuizQuestionRemove,
  requestQuizQuestionMove,
  requestQuizTransfer
} from './httpRequests';
import { 
  TokenReturn, 
  QuizId, 
  Quiz, 
  QuestionBody, 
  QuestionId,
  ErrorObject
} from './interfaces'

beforeEach(() => {
  requestClear();
});

describe('requestQuizList', () => {
  test('correct output of list of quizzes', () => {
    const resToken: TokenReturn = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz1 = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    const quiz2 = requestQuizCreate(resToken.token, 'asdfasdf', 'Welcome!');
    expect(requestQuizList(resToken.token)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz1.quizId,
          name: 'COMP1531',
        },
        {
          quizId: quiz2.quizId,
          name: 'asdfasdf',
        },
      ]
    });
    const resToken2 = requestAuthRegister('quiz1@unsw.edu.au',
      'abcd1234', 'Stephen', 'Robertson');
    const quiz3 = requestQuizCreate(resToken2.token, 'BOBBY', 'HELLO');
    const quiz4 = requestQuizCreate(resToken2.token, 'LOLLY', 'alksdjf');
    expect(requestQuizList(resToken2.token)).toStrictEqual({
      quizzes: [
        {
          quizId: quiz3.quizId,
          name: 'BOBBY',
        },
        {
          quizId: quiz4.quizId,
          name: 'LOLLY',
        },
      ]
    });
  });

  test('token doesnt exist', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz1 = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    const quiz2 = requestQuizCreate(resToken.token, 'asdfasdf', 'Welcome!');
    expect(requestQuizList('bob')).toStrictEqual({ error: expect.any(String) });
  });
});

describe('requestQuizCreate', () => {
  test('successful quiz creation', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(quiz).toStrictEqual({ quizId: expect.any(Number) });
  });

  test('token doesnt exist', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate('1', 'COMP1531', 'Welcome!');
    expect(quiz).toStrictEqual({ error: expect.any(String) });
  });

  test.each([
    { name: '' },
    { name: '1' },
    { name: 'Abaklwjef++++__....!!' },
    { name: '-()*()$@&%)@(^*!' },
    { name: 'ghijklmnopqrstuvwxyz1234125176123512351235' },
  ])("checking name restrictions: '$name'", ({ name }) => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, name, 'Welcome!');
    expect(quiz).toStrictEqual({ error: expect.any(String) });
  });

  test('name is already being used', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz1 = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    const quiz2 = requestQuizCreate(resToken.token, 'COMP1531', 'Blahblah!');
    expect(quiz2).toStrictEqual({ error: expect.any(String) });
  });

  test('two different users can have same quizname', () => {
    const resToken = requestAuthRegister('quiz1@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const resToken2 = requestAuthRegister('quiz2@unsw.edu.au',
      'abcd1234', 'Sobby', 'Mickens');
    const quiz1 = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    const quiz2 = requestQuizCreate(resToken2.token, 'COMP1531', 'BLAHBLAH');
    expect(quiz2).toStrictEqual({ quizId: expect.any(Number) });
  });

  test('description is over 100 characters long', () => {
    const description = `Twinkle twinkle little star, how I wonder what you are. 
        Up above the world so high. Like a diamond in the sky. Twinkle twinkle 
        little star, how I wonder what you are.`;
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531', description);
    expect(quiz).toStrictEqual({ error: expect.any(String) });
  });
});

describe('requestQuizRemove', () => {
  test('successful removal of quiz', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizRemove(resToken.token, quiz.quizId)).toEqual({});
    expect(requestQuizList(resToken.token)).toStrictEqual({
      quizzes: []
    });
  });

  test('token doesnt exist', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizRemove('1', quiz.quizId)).toStrictEqual({ error: expect.any(String) });
  });

  test('quizId doesnt refer to a valid quiz', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizRemove(resToken.token, quiz.quizId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('quiz doesnt belong to this user', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const resToken2 = requestAuthRegister('quiz1@unsw.edu.au',
      'abcd1234', 'Robby', 'Smith');
    const quiz1 = requestQuizCreate(resToken2.token, 'HAHA1531', 'Welcome!');
    expect(requestQuizRemove(resToken.token, quiz1.quizId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('requestQuizInfo', () => {
  test('Quiz info retrieved successfully', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    const quizInfo = requestQuizInfo(resToken.token, quizId.quizId);
    // Define the expected quiz information structure
    const expectedQuizInfo = {
      quizId: expect.any(Number),
      name: 'COMP1531', // Assuming 'name' property is available in quizInfo
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Welcome!'
    };

    // Compare quizInfo object with the expected quiz information structure
    expect(quizInfo).toStrictEqual(expectedQuizInfo);
  });

  // Error checks
  test('Token is not a token', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizInfo('1', quizId.quizId)).toStrictEqual({ error: expect.any(String) });
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizInfo(resToken.token, quizId.quizId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('quiz doesnt belong to this user', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Smith');
    const resToken2 = requestAuthRegister('quiz1@unsw.edu.au', 'abcd1234', 'Robby', 'Smith');
    const quizId1 = requestQuizCreate(resToken2.token, 'COMP1531', 'Welcome!');
    expect(requestQuizInfo(resToken.token, quizId1.quizId)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('requestQuizNameUpdate', () => {
  // Successful Check
  test('Successful Quiz Name Update', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizNameUpdate(resToken.token, quizId.quizId, 'newName')).toEqual({});
    const quizInfo = requestQuizInfo(resToken.token, quizId.quizId);
    expect(quizInfo.name).toStrictEqual('newName');
  });

  // Error Checks

  test('Token is not a token', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizNameUpdate('1', quizId.quizId, 'newName')).toEqual({ error: expect.any(String) });
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    expect(requestQuizNameUpdate(resToken.token, quizId.quizId + 1, 'newName')).toEqual({ error: expect.any(String) });
  });

  test('quiz doesnt belong to this user', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Smith');
    const resToken2 = requestAuthRegister('quiz1@unsw.edu.au', 'abcd1234', 'Robby', 'Smith');
    const quizId1 = requestQuizCreate(resToken2.token, 'COMP1531', 'Welcome!');
    expect(requestQuizNameUpdate(resToken.token, quizId1.quizId, 'name')).toStrictEqual({ error: expect.any(String) });
  });

  test.each([
    { name: '' },
    { name: '1' },
    { name: 'Abaklwjef++++__....!!' },
    { name: '-()*()$@&%)@(^*!' },
    { name: 'ghijklmnopqrstuvwxyz1234125176123512351235' },
  ])("checking name restrictions: '$name'", ({ name }) => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quizId = requestQuizCreate(resToken.token, name, 'Welcome!');
    expect(quizId).toStrictEqual({ error: expect.any(String) });
    const updateQuizName = requestQuizNameUpdate(resToken.token, quizId.quizId, name);
    expect(updateQuizName).toStrictEqual({ error: expect.any(String) });
  });

  test('name is already being used', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const quizId1 = requestQuizCreate(resToken.token, 'COMP1531', 'Welcome!');
    const quizId2 = requestQuizCreate(resToken.token, 'bahahaha', 'Blahblah!');
    expect(requestQuizNameUpdate(resToken.token, quizId2.quizId, 'COMP1531!')).toStrictEqual({ error: expect.any(String) });
  });
});

describe('requestQuizDescriptionUpdate', () => {
  test('Check successful update quiz description', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531',
      'Write a descrition for this quiz.');
    const quizDescription = requestQuizDescriptionUpdate(resToken.token,
      quiz.quizId, 'New Description.');
    expect(quizDescription).toStrictEqual({});
    const quizInfo = requestQuizInfo(resToken.token, quiz.quizId);
    expect(quizInfo.description).toStrictEqual('New Description.');
  });

  test('Token is not a token', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531',
      'Write a descrition for this quiz.');
    expect(requestQuizDescriptionUpdate('1', quiz.quizId,
      'Description.')).toStrictEqual({ error: expect.any(String) });
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531',
      'Write a descrition for this quiz.');
    expect(requestQuizDescriptionUpdate(resToken.token, quiz.quizId + 1,
        'Description.')).toStrictEqual({ error: expect.any(String) });
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531',
      'Write a descrition for this quiz.');
    const resToken2 = requestAuthRegister('xyz@unsw.edu.au',
      'abcd1234', 'Henry', 'Duckens');
    const quiz2 = requestQuizCreate(resToken2.token, 'COMP1531',
      'Write a descrition for the quiz.');
    expect(requestQuizDescriptionUpdate(resToken.token, quiz2.quizId,
      'Description.')).toStrictEqual({ error: expect.any(String) });
  });

  test('Description is more than 100 characters in length.', () => {
    const resToken = requestAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    const quiz = requestQuizCreate(resToken.token, 'COMP1531',
      'Write a descrition for this quiz.');
    expect(requestQuizDescriptionUpdate(resToken.token, quiz.quizId,
      `How much wood can a wood chucker chuck wood? I don't actually know 
      but that was a great character count filler.`
    )).toStrictEqual({ error: expect.any(String) });
  });
});


// adminQuizTransfer:
// Goal: Transfer first user's quiz to user2.
describe('Testing PUT /v1/admin/quiz/{qizId}/transfer', () => {
  let user: any, quiz: any, user2: any, quiz2: any;
  beforeEach(() => {
    // return a token
    user = requestAuthRegister("first@unsw.edu.au", "FirstUser123", "First", "User");
    // return a quizId
    quiz = requestQuizCreate(user.token, "COMP1531", "A description of my quiz");
    // create second user
    user2 = requestAuthRegister("second@unsw.edu.au", "SecondUser123", "Second", "User");
    quiz2 = requestQuizCreate(user2.token, "COMP1531", "A description of my quiz");
  });

  // Error: 400 Bad Request
  // - userEmail is not a real user
  // - userEmail is the currently logged in user.
  // - quiz name same as target's quiz name
  test.each([
    {
      token: user2.token,
      email: "notReal@unsw.edu.au", 
      quizId: quiz2.quizId
    }, 
    {
      token: user.token, 
      email: "first@unsw.edu.au",
      quizId: quiz.quizId
    },
    {
      token: user.token, 
      email: "second@nsw.edu.au",
      quizId: quiz.quizId
    },
  ])('Bad request', ({token, email, quizId}) => {
    const response = requestQuizTransfer(token, quizId, email);
    expect(response.statusCode).toStrictEqual(400);
    expect(response.bodyObj).toStrictEqual({error: expect.any(String)})
  });

  test('Invalid Token', () => {
    // first user
    const response = requestQuizTransfer(String(Number(user.token) + 1), quiz.quizId, "first@unsw.edu.au"); 
    expect(response.statusCode).toStrictEqual(401);
    expect(response.bodyObj).toStrictEqual({error: expect.any(String)});
    // second user
    const response2 = requestQuizTransfer(String(Number(user2.token) + 1), quiz2.quizId, "second@unsw.edu.au", ); 
    expect(response2.statusCode).toStrictEqual(401);
    expect(response2.bodyObj).toStrictEqual({error: expect.any(String)});
  });
  
  test('Valid token; quiz not owned by user. (userId not found in quiz)', () => {
    // first user (testing the user who is transfering quiz)
    const response = requestQuizTransfer(user.token, quiz.quizId + 1, "first@unsw.edu.au")
    expect(response.statusCode).toStrictEqual(403);
    expect(response.bodyObj).toStrictEqual({error: expect.any(String)});
  });

  test('Successful return and status code', () => {
    // Transfer: first user's token, second user's email, first user's quizId.
    const response = requestQuizTransfer(user.token, quiz.quizId, "second@unsw.edu.au",);
    expect(response.statusCode).toStrictEqual(200);
    expect(response.bodyObj).toStrictEqual({});
  });
});
