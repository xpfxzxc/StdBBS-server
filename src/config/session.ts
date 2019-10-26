import app from './app';

export default {
  cookie: {
    httpOnly: true,
    maxAge: 3600 * 1000,
    sameSite: process.env.SESSION_COOKIE_SAME_SITE,
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
  },
  name: `${app.name}.sid`,
  resave: false,
  saveUninitialized: false,
  secret: '+n*9yXAbX^QAq$UC',
};
