import { Pool } from 'mysql2/promise';

declare module 'express' {
  interface Application {
    get(name: 'db'): Pool;
  }
  interface Request {
    user?: any; // Or define a proper User type
  }
}