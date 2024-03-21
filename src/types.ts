//Error interface
export interface ErrorObject {
  error: string
};

//User interface
export interface User {
  userId: number,
  nameFirst: string,
  nameLast: string,
  email: string,
  password: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number,
  oldPasswords: string[]
}

//Quiz interface
export interface Quiz {
  quizId: number,
  name: string,
  quizCreatorId: number,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  questions: string[],
  answers: string[]
}

//Token interface
export interface Token {
  token: string,
  userId: number
}
//AuthUserId interface
export interface AuthUserId {
  authUserId: number
}

//QuizId interface
export interface QuizId {
  quizId: number
};
//UserDetails interface (return type)
export interface UserDetails {
	user: {
		userId: number,
		name: string,
		email: string,
		numSuccessfulLogins: number,
		numFailedPasswordsSinceLastLogin: number
	}
}

//Token return type
export interface TokenReturn {
  token: string
}

//Quiz summarised in this form
interface QuizListNameId {
  quizId: number,
  name: string
}

//adminQuizList return type
interface AdminQuizListReturn {
  quizzes: QuizListNameId[]
}

//adminQuizInfo return type
interface AdminQuizInfoReturn {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string
}


//DataStore interface
export interface Data {
  users: User[],
  quizzes: Quiz[],
  tokens: Token[]
}