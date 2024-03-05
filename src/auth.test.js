import { adminAuthRegister, adminAuthLogin, adminUserDetailsUpdate} from './auth.js';
import { clear } from './other.js';

describe('adminAuthRegister', () => { 
    test('successful registration', () => {
        clear();
        let authUserId = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(authUserId).toEqual( { authUserId: expect.any(Number) });
    });

    test('duplicate email', () => {
        clear();
        let authUserId1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        let authUserId2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(authUserId2).toEqual({ error: expect.any(String)});
    });

    test('email is not valid', () => {
        clear();
        let authUserId = adminAuthRegister('123', '1234abcd!@#$'
        , 'FirstName', 'LastName');
        expect(authUserId).toEqual({ error: expect.any(String)})
    });

    test('invalid characters in nameFirst', () => {
        clear();
        let authUserId1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , '1234567890', 'LastName');
        expect(authUserId1).toEqual({ error: expect.any(String)});
        let authUserId2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , '!@#$%^&*()_+=|?><', 'LastName');
        expect(authUserId2).toEqual({ error: expect.any(String)});
    });

    test('invalid nameFirst length', () => {
        clear();
        let authUserId1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'A', 'LastName');
        expect(authUserId1).toEqual({ error: expect.any(String)});
        clear();
        let authUserId2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'ABCDEFGHIJKLMNOPQRSTU', 'LastName');
        expect(authUserId2).toEqual({ error: expect.any(String)});
    });

    test('invalid characters in nameLast', () => {
        clear();
        let authUserId1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', '1234567890');
        expect(authUserId1).toEqual({ error: expect.any(String)});
        let authUserId2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', '!@#$%^&*()_+=|?><');
        expect(authUserId2).toEqual({ error: expect.any(String)});
    });

    test('invalid nameLast length', () => {
        clear();
        let authUserId1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'A');
        expect(authUserId1).toEqual({ error: expect.any(String)});
        clear();
        let authUserId2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'ABCDEFGHIJKLMNOPQRSTU');
        expect(authUserId2).toEqual({ error: expect.any(String)});
    });

    test('invalid password length', () => {
        clear();
        let authUserId1 = adminAuthRegister('users@unsw.edu.au', ''
        , 'FirstName', 'LastName');
        expect(authUserId1).toEqual({ error: expect.any(String)});
        let authUserId2 = adminAuthRegister('users@unsw.edu.au', '1'
        , 'FirstName', 'LastName');
        expect(authUserId2).toEqual({ error: expect.any(String)});
        let authUserId3 = adminAuthRegister('users@unsw.edu.au', '12'
        , 'FirstName', 'LastName');
        expect(authUserId3).toEqual({ error: expect.any(String)});
        let authUserId4 = adminAuthRegister('users@unsw.edu.au', '123'
        , 'FirstName', 'LastName');
        expect(authUserId4).toEqual({ error: expect.any(String)});
        let authUserId5 = adminAuthRegister('users@unsw.edu.au', '1234'
        , 'FirstName', 'LastName');
        expect(authUserId5).toEqual({ error: expect.any(String)});
        let authUserId6 = adminAuthRegister('users@unsw.edu.au', '12345'
        , 'FirstName', 'LastName');
        expect(authUserId6).toEqual({ error: expect.any(String)});
        let authUserId7 = adminAuthRegister('users@unsw.edu.au', '123456'
        , 'FirstName', 'LastName');
        expect(authUserId7).toEqual({ error: expect.any(String)});
        let authUserId8 = adminAuthRegister('users@unsw.edu.au', '1234567'
        , 'FirstName', 'LastName');
        expect(authUserId8).toEqual({ error: expect.any(String)});
    });

    test('unsatisfactory password', () => {
        clear();
        let user1 = adminAuthRegister('users@unsw.edu.au', '12345678'
        , 'FirstName', 'LastName');
        expect(user1).toEqual({ error: expect.any(String)});
        let user2 = adminAuthRegister('users@unsw.edu.au', 'abcdefgh'
        , 'FirstName', 'LastName');
        expect(user2).toEqual({ error: expect.any(String)});
    });
});

describe('adminAuthLogin', () => {
    test('successful login', () => {
        clear();
        adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        let authUserId = adminAuthLogin('users@unsw.edu.au', '1234abcd');
        expect(authUserId).toEqual({ authUserId: expect.any(Number) });
    });

    test('Email does not exist', () => {
        clear();
        let authUserId = adminAuthLogin('users@unsw.edu.au', '1234abcd');
        expect(authUserId).toEqual({ error: expect.any(String) });
    });

    test('Incorrect password', () => {
        clear();
        adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        let authUserId = adminAuthLogin('users@unsw.edu.au', '1234abce');
        expect(authUserId).toEqual({ error: expect.any(String) });
    });
});

describe('adminUserDetailsUpdate', () => {

    test('AuthUserId is not a valid user', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user.authUserId + 3, 'users@unsw.edu.au', 'FirstName', 'LastName')).toEqual({ error: expect.any(String) });
    });

    test('Email is currently used by another user', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        adminAuthRegister('ZoeChens@unsw.edu.au', '1234abcd', 'Zoe', 'Chen');
        expect(adminUserDetailsUpdate(user.authUserId, 'ZoeChens@unsw.edu.au', 'FirstName', 'LastName')).toStrictEqual({ error: expect.any(String) });
    });

    test('Email is invalid', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user.authUserId, '123', 'FirstName', 'LastName')).toStrictEqual({ error: expect.any(String)})
    });

    test('invalid characters in nameFirst', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user.authUserId, 'users@unsw.edu.au', '!@#$%^&1234', 'LastName')).toStrictEqual({ error: expect.any(String) });
    });

    test('invalid nameFirst length', () => {
        clear();
        let user1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user1.authUserId, 'users@unsw.edu.au', 'A', 'LastName')).toStrictEqual({ error: expect.any(String) });
        clear();
        let user2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user2.authUserId, 'users@unsw.edu.au', 'ABcdefghijklmnopqrstu', 'LastName')).toStrictEqual({ error: expect.any(String) });
    });

    test('invalid characters in nameLast', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user.authUserId, 'users@unsw.edu.au', 'FirstName', '!@#$%^&1234')).toStrictEqual({ error: expect.any(String) });
    });

    test('invalid nameLast length', () => {
        clear();
        let user1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user1.authUserId, 'users@unsw.edu.au', 'FirstName', 'A')).toStrictEqual({ error: expect.any(String) });
        clear();
        let user2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserDetailsUpdate(user2.authUserId, 'users@unsw.edu.au', 'FirstName', 'ABcdefghijklmnopqrstu')).toStrictEqual({ error: expect.any(String) });
    });

    test('Successefully update', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect( adminUserDetailsUpdate(user.authUserId, 'users@unsw.edu.au', 'FirstName', 'Chen')).toEqual({});
    });
});

describe('adminUserPasswordUpdate', () => {

    test('AuthUserId is not a valid user', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user.authUserId + 1, '1234abcd', 'abcd1234')).toEqual({ error: expect.any(String) });
    });
 
    test('Old Password is not the correct old password', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user.authUserId, 'wrong1234', 'abcd1234')).toEqual({ error: expect.any(String) });
    });
 
    test('New Password has already been used before by this user', () => {
        clear();
        let user1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        let user2 = adminAuthRegister('users@unsw.edu.au', 'abcd1234'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user1.authUserId, '1234abcd', 'abcd1234')).toEqual({ error: expect.any(String) });
    });
 
    test('invalid password length', () => {
        clear();
        let user1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user1.authUserId, 'abcd1234', '')).toEqual({ error: expect.any(String)});
        let user2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user2.authUserId, 'abcd1234', '1')).toEqual({ error: expect.any(String)});
        let user3 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user3.authUserId, 'abcd1234', '12')).toEqual({ error: expect.any(String)});
        let user4 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user4.authUserId, 'abcd1234', '123')).toEqual({ error: expect.any(String)});
        let user5 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user5.authUserId, 'abcd1234', '1234')).toEqual({ error: expect.any(String)});
        let user6 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user6.authUserId, 'abcd1234', '12345')).toEqual({ error: expect.any(String)});
        let user7 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user7.authUserId, 'abcd1234', '123456')).toEqual({ error: expect.any(String)});
        let user8 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user8.authUserId, 'abcd1234', '1234567')).toEqual({ error: expect.any(String)});
    });
 
    test('unsatisfactory password', () => {
        clear();
        let user1 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user1.authUserId, 'abcd1234', '12345678')).toEqual({ error: expect.any(String)});
        let user2 = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user2.authUserId, 'abcd1234', 'abcdefgh')).toEqual({ error: expect.any(String)});
    });
 
 
    test('successful update password', () => {
        clear();
        let user = adminAuthRegister('users@unsw.edu.au', '1234abcd'
        , 'FirstName', 'LastName');
        expect(adminUserPasswordUpdate(user.authUserId, '1234abcd', 'abcd1234')).toEqual({});
    });
});
 


