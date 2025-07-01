// src/types.ts
export interface Task {
  id?: number;
  title: string;
  text: string;
  completed: boolean;
}

//addsurvey.tsx
export interface Reference {
  id: string;
  fullName: string;
  email: string;
  link: string;
}

//navbar.tsx
export interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePage?: string;
}

//Dashboard.tsx
export interface Employeed {
  id: number;
  fullName: string;
  position: string;
  references: number;
  rating: number;
  questions: string[];
  ref: EmployeeProps[];
}

interface Response2 {
  id?: number; // Optional since it's not returned in your query
  questionId: number;
  referenceId: number;
  rating: number;
}

export interface EmployeeProps{
  id: number;
  email: string;
  fullName: string;
  is_submitted: boolean;
  link: string;
  comments: string;
  notification_type: string;
  responses: Response2[];
}

export interface SelectedEmployee {
  employeeref: EmployeeProps[];
  questions: string[];
  name?: string;
}

//server.ts
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
  responses?: Response[];
}

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  ref: SurveyReference[];
  questions: string[]; // Optional, if you want to include questions
}

export interface user {
  id: number;
  email: string;
  password: string;
  created_at?: string;
}

//configuresurvey.tsx
export interface Questions {
  id: number;
  text: string;
  arrange_order: number;
}