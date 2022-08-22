const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
import { Handler, NextFunction, Request } from 'express';
export const authorize: Handler = async (req, res, next: NextFunction) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      res.status(401).json({ message: 'not authorised please sign in' });
    }

    const payload = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: {
        id: payload.user,
      },
    });
    if (user != null) req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const optional: Handler = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token == null) {
      console.log(`there is no token  }`);
      next();
    } else {
      const payload = await promisify(jwt.verify)(
        token,
        process.env.SECRET_KEY
      );
      let id = payload.user;
      let user = await prisma.user.findUnique({ where: { id } });
      if (user == null) {
        res.status(401).json('not authourised invalid token');
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.status(403).json('not authourised');
  }
};

export const checkCookie = (req: Request) => {
  const cookies = req.cookies;

  if ('session_id' in cookies) {
    var session_id = cookies.session_id;
  }
  if (session_id) {
    return session_id;
  } else {
    const id = v4();
    return id;
  }
};
