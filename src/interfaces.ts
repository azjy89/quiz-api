import { QuestionDotToken } from "typescript"

// Error interface
export interface ErrorObject {
  error: string
};

// User interface
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

// Quiz interface
export interface Quiz {
  quizId: number,
  name: string,
  ownerId: number,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  questions: Question[],
  duration: number,
}

// Token interface
export interface Token {
  token: string,
  userId: number
}
// AuthUserId interface
export interface AuthUserId {
  authUserId: number
}

// QuizId interface
export interface QuizId {
  quizId: number
};
// UserDetails interface (return type)
export interface UserDetails {
	user: {
		userId: number,
		name: string,
		email: string,
		numSuccessfulLogins: number,
		numFailedPasswordsSinceLastLogin: number
	}
}

// Token return type
export interface TokenReturn {
  token: string
}

// Quiz summarised in this form
export interface QuizListNameId {
  quizId: number,
  name: string
}

// adminQuizList return type
export interface AdminQuizListReturn {
  quizzes: QuizListNameId[]
}

// adminQuizInfo return type
export interface AdminQuizInfoReturn {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string
}

// Question type
export interface Question {
  questionBody: QuestionBody,
  questionId: number
}

// questionBody input type
export interface QuestionBody {
  question: string,
  duration: number,
  points: number,
  answers: AnswerInput[]
}

// AnswerInput type
export interface AnswerInput {
  answer: string,
  correct: boolean
}

// questionid return type
export interface QuestionId {
  questionId: number
}

export interface DupedQuestionId {
  dupedQuestionId: number
}

// DataStore interface
export interface Data {
  users: User[],
  quizzes: Quiz[],
  tokens: Token[]
}