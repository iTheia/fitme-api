import app from './app';
import database from './database';
import hashing from './hashing';
import token from './token';
export * from './validation';

export const config = [app, database, hashing, token];
