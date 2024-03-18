
import { adminQuizList, adminQuizCreate, adminQuizRemove, adminQuizInfo, adminQuizNameUpdate, adminQuizDescriptionUpdate } from './quiz';
import { adminAuthRegister } from './auth';
import { clear } from './other';
beforeEach(() => {
  clear();
});

describe('adminQuizList', () => {
  beforeEach(() => {
    clear();
  });
  
  test('correct output of list of quizzes', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz1 = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      const quiz2 = adminQuizCreate(user.authUserId, 'asdfasdf', 'Welcome!');
      if ('quizId' in quiz1 && 'quizId' in quiz2) { 
      expect(adminQuizList(user.authUserId)).toStrictEqual({
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
      }
    }
    const user1 = adminAuthRegister('quiz1@unsw.edu.au',
      'abcd1234', 'Stephen', 'Robertson');
    if ('authUserId' in user1) {
      const quiz3 = adminQuizCreate(user1.authUserId, 'BOBBY', 'HELLO');
      const quiz4 = adminQuizCreate(user1.authUserId, 'LOLLY', 'alksdjf');
      if ('quizId' in quiz3 && 'quizId' in quiz4) {
      expect(adminQuizList(user1.authUserId)).toStrictEqual({
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
      }
    }
  });

  test('authUserId doesnt exist', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz1 = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      const quiz2 = adminQuizCreate(user.authUserId, 'asdfasdf', 'Welcome!');
      expect(adminQuizList(user.authUserId + 1)).toStrictEqual({ error: expect.any(String) });
    }
  });
});

describe('adminQuizCreate', () => {
  beforeEach(() => {
    clear();
  });

  test('successful quiz creation', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      expect(quiz).toStrictEqual({ quizId: expect.any(Number) });
    }
  });

  test('authUserId doesnt exist', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId + 1, 'COMP1531', 'Welcome!');
      expect(quiz).toStrictEqual({ error: expect.any(String) });
    }
  });

  test.each([
    { name: '' },
    { name: '1' },
    { name: 'Abaklwjef++++__....!!' },
    { name: '-()*()$@&%)@(^*!' },
    { name: 'ghijklmnopqrstuvwxyz1234125176123512351235' },
  ])("checking name restrictions: '$name'", ({ name }) => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, name, 'Welcome!');
      expect(quiz).toStrictEqual({ error: expect.any(String) });
    }
  });

  test('name is already being used', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz1 = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      const quiz2 = adminQuizCreate(user.authUserId, 'COMP1531', 'Blahblah!');
      expect(quiz2).toStrictEqual({ error: expect.any(String) });
    }
  });

  test('two different users can have same quizname', () => {
    const user1 = adminAuthRegister('quiz1@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const user2 = adminAuthRegister('quiz2@unsw.edu.au',
      'abcd1234', 'Sobby', 'Mickens');
    if ('authUserId' in user1 && 'authUserId' in user2) {
      const quiz1 = adminQuizCreate(user1.authUserId, 'COMP1531', 'Welcome!');
      const quiz2 = adminQuizCreate(user2.authUserId, 'COMP1531', 'BLAHBLAH');
      expect(quiz2).toStrictEqual({ quizId: expect.any(Number) });
    }
  });

  test('description is over 100 characters long', () => {
    const description = `Twinkle twinkle little star, how I wonder what you are. 
        Up above the world so high. Like a diamond in the sky. Twinkle twinkle 
        little star, how I wonder what you are.`;
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531', description);
      expect(quiz).toStrictEqual({ error: expect.any(String) });
    }
  });
});

describe('adminQuizRemove', () => {
  beforeEach(() => {
    clear();
  });

  test('successful removal of quiz', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quiz) {
        expect(adminQuizRemove(user.authUserId, quiz.quizId)).toEqual({});
        expect(adminQuizList(user.authUserId)).toStrictEqual({
          quizzes: [
          ]
        });
      }
    }
  });

  test('authUserId doesnt exist', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quiz) {
        expect(adminQuizRemove(user.authUserId + 1, quiz.quizId)).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('quizId doesnt refer to a valid quiz', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quiz) {
        expect(adminQuizRemove(user.authUserId, quiz.quizId + 1)).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('quiz doesnt belong to this user', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    const user1 = adminAuthRegister('quiz1@unsw.edu.au',
      'abcd1234', 'Robby', 'Smith');
    if ('authUserId' in user1) {
      const quiz1 = adminQuizCreate(user1.authUserId, 'HAHA1531', 'Welcome!');
      if ('quizId' in quiz1) {
        if ('authUserId' in user) {
          expect(adminQuizRemove(user.authUserId, quiz1.quizId)).toStrictEqual({ error: expect.any(String) });
        }
      }
    }
  });
});

describe('adminQuizInfo', () => {
  beforeEach(() => {
    clear();
  });

  // Successful check wa

  test('Quiz info retrieved successfully', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId) {
        const quizInfo = adminQuizInfo(authUserId.authUserId, quizId.quizId);
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
      }
    }
  });

  // Error checks
  test('AuthUserId is not a valid user', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId) {
        expect(adminQuizInfo(authUserId.authUserId + 1, quizId.quizId)).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId) {
        expect(adminQuizInfo(authUserId.authUserId, quizId.quizId + 1)).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('quiz doesnt belong to this user', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Smith');
    const authUserId1 = adminAuthRegister('quiz1@unsw.edu.au', 'abcd1234', 'Robby', 'Smith');
    if ('authUserId' in authUserId && 'authUserId' in authUserId1) {
      const quizId1 = adminQuizCreate(authUserId1.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId1) {
        expect(adminQuizInfo(authUserId.authUserId, quizId1.quizId)).toStrictEqual({ error: expect.any(String) });
      }
    }
  });
});

describe('adminQuizNameUpdate', () => {
  beforeEach(() => {
    clear();
  });

  // Successful Check
  test('Successful Quiz Name Update', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId) {      
        expect(adminQuizNameUpdate(authUserId.authUserId, quizId.quizId, 'newName')).toEqual({});
        const quizInfo = adminQuizInfo(authUserId.authUserId, quizId.quizId);
        if ('name' in quizInfo) {
          expect(quizInfo.name).toStrictEqual('newName');
        }
      }
    }
  });

  // Error Checks

  test('AuthUserId is not a valid user', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId) {      
        expect(adminQuizNameUpdate(authUserId.authUserId + 1, quizId.quizId, 'newName')).toEqual({ error: expect.any(String) });
      }
    }
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      if ('quizId' in quizId) {      
        expect(adminQuizNameUpdate(authUserId.authUserId, quizId.quizId + 1, 'newName')).toEqual({ error: expect.any(String) });
      }
    }
  });

  test('quiz doesnt belong to this user', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au', 'abcd1234', 'Bobby', 'Smith');
    const authUserId1 = adminAuthRegister('quiz1@unsw.edu.au', 'abcd1234', 'Robby', 'Smith');
    if ('authUserId' in authUserId1) {
      const quizId1 = adminQuizCreate(authUserId1.authUserId, 'COMP1531', 'Welcome!');
      if ('authUserId' in authUserId && 'quizId' in quizId1) {
        expect(adminQuizNameUpdate(authUserId.authUserId, quizId1.quizId, 'name')).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test.each([
    { name: '' },
    { name: '1' },
    { name: 'Abaklwjef++++__....!!' },
    { name: '-()*()$@&%)@(^*!' },
    { name: 'ghijklmnopqrstuvwxyz1234125176123512351235' },
  ])("checking name restrictions: '$name'", ({ name }) => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId = adminQuizCreate(authUserId.authUserId, name, 'Welcome!');
      expect(quizId).toStrictEqual({ error: expect.any(String) });
      if ('quizId' in quizId) {
        const updateQuizName = adminQuizNameUpdate(authUserId.authUserId, quizId.quizId, name);
        expect(updateQuizName).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('name is already being used', () => {
    const authUserId = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'Bobby', 'Dickens');
    if ('authUserId' in authUserId) {
      const quizId1 = adminQuizCreate(authUserId.authUserId, 'COMP1531', 'Welcome!');
      const quizId2 = adminQuizCreate(authUserId.authUserId, 'bahahaha', 'Blahblah!');
      if ('quizId' in quizId2) {
        expect(adminQuizNameUpdate(authUserId.authUserId, quizId2.quizId, 'COMP1531!')).toStrictEqual({ error: expect.any(String) });
      }
    }
  });
});

describe('adminQuizDescriptionUpdate', () => {
  beforeEach(() => {
    clear();
  });

  test('Check successful update quiz descrition', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531',
      'Write a descrition for this quiz.');
      if ('quizId' in quiz) {
        const quizDescription = adminQuizDescriptionUpdate(user.authUserId,
        quiz.quizId, 'New Description.');
        expect(quizDescription).toStrictEqual({});
        const quizInfo = adminQuizInfo(user.authUserId, quiz.quizId);
        if ('description' in quizInfo) {
          expect(quizInfo.description).toStrictEqual('New Description.');
        }
      }
    }
  });

  test('AuthUserId is not a valid user', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531',
        'Write a descrition for this quiz.');
      if ('quizId' in quiz) {
        expect(adminQuizDescriptionUpdate(user.authUserId + 1, quiz.quizId,
        'Description.')).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('Quiz ID does not refer to a valid quiz', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531',
        'Write a descrition for this quiz.');
      if ('quizId' in quiz) {
        expect(adminQuizDescriptionUpdate(user.authUserId, quiz.quizId + 1,
        'Description.')).toStrictEqual({ error: expect.any(String) });
      }
    }
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531',
        'Write a descrition for this quiz.');
      const user2 = adminAuthRegister('xyz@unsw.edu.au',
        'abcd1234', 'Henry', 'Duckens');
      if ('authUserId' in user2) {
      const quiz2 = adminQuizCreate(user2.authUserId, 'COMP1531',
        'Write a descrition for the quiz.');
        if ('quizId' in quiz2) {
          expect(adminQuizDescriptionUpdate(user.authUserId, quiz2.quizId,
          'Description.')).toStrictEqual({ error: expect.any(String) });
        }
      }
    }
  });

  test('Description is more than 100 characters in length.', () => {
    const user = adminAuthRegister('quiz@unsw.edu.au',
      'abcd1234', 'John', 'Dickens');
    if ('authUserId' in user) {
      const quiz = adminQuizCreate(user.authUserId, 'COMP1531',
        'Write a descrition for this quiz.');
      if ('quizId' in quiz) {
        expect(adminQuizDescriptionUpdate(user.authUserId, quiz.quizId,
            `How much wood can a wood chucker chuck wood? I don't actually know 
            but that was a great character count filler.`
        )).toStrictEqual({ error: expect.any(String) });
      }
    }
  });
});
