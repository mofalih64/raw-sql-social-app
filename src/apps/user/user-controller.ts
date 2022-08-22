import { User } from '@prisma/client';
import { Handler } from 'express';
import { prisma } from 'src/prisma/prisma.service';
import { jwtGenerstor } from '../utils/jwtGenerator';
import { getUuid } from '../../utils/index';

export const signUp: Handler = async (req, res) => {
  try {
    const { email, password, firstName } = req.body;
    var checkEmail: [{}] =
      await prisma.$queryRaw`SELECT * FROM users where email=${email}`;

    if (!checkEmail[0]) {
      const id = getUuid();
      const newUser = await prisma.$queryRaw<
        User[]
      >`INSERT INTO users (id,email,password) VALUES (${id},${email},${password}) RETURNING *`;
      req.user = newUser;

      const token = jwtGenerstor(newUser[0].id);

      res.status(201).json({
        status: 'success',
        token,
      });
    } else {
      res.status(400).json({
        message: 'the email is allready used',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.status(403).json('not authourised');
  }
};

export const signIn: Handler = async (req, res) => {
  const { email, password } = req.body;
  const checkEmail = await prisma.$queryRaw<
    User[]
  >`SELECT * FROM users where email =${email}`;

  if (checkEmail[0].id == null) {
    res.status(404).json({
      message: 'un valid email or password',
    });
  } else {
    if (password == checkEmail[0].password) {
      const token = jwtGenerstor(checkEmail[0].id);

      res.status(201).json({
        status: 'success',
        token,
      });
    } else {
      res.status(404).json({
        message: 'un valid email or password',
      });
    }
  }
};

export const getPostsUserSaw: Handler = async (req, res) => {
  const user = req.user as User;
  try {
    const posts = await prisma.$queryRaw` SELECT *
    FROM posts INNER JOIN post_seen_by ON (posts.id = post_seen_by.post_id) where post_seen_by.user_id =${user.id}`;

    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    res.json({
      message: 'failed',
    });
  }
};

export const getUserPosts: Handler = async (req, res) => {
  try {
    const user = req.user as User;
    console.log(`the user ${user.id},, ${user.firstName}`);
    const posts =
      await prisma.$queryRaw`SELECT * FROM posts WHERE user_id = ${user.id}`;

    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    res.json({
      message: 'failed2',
    });
  }
};
