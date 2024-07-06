import app from './app';
import database from './database';
import token from './token';
import googleOauth from './google-oauth';
export * from './validation';

export const config = [app, database, token, googleOauth];
