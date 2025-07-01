export interface Reference {
  id: number;
  fullName: string;
  email: string;
  link: string;
  is_submitted: boolean;
  responses: {
    questionId: number;
    referenceId: number;
    rating: number;
  }[];
}

export interface Response {
  id?: number; // Optional since it's not returned in your query
  questionId: number;
  referenceId: number;
  rating: number;
}

export interface SurveyReference {
  id: number;
  surveyId?: number;
  fullName: string;
  email: string;
  link: string;
  is_submitted: boolean;
  comments: string;
  notification_type: string;
  responses?: Response[];
}

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  ref: SurveyReference[];
  questions: string[]; // Optional, if you want to include questions
}

