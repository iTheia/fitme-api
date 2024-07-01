import app from './app';
import database from './database';
import token from './token';
export * from './validation';

export const config = [app, database, token];
