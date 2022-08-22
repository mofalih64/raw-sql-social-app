import { User, Post } from '@prisma/client';
import { Handler } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authController = require('../user/auth-controller');
const { v4 } = require('uuid');

function getUuid() {
  return v4();
}
export const getPost: Handler = async (req, res) => {
  try {
    const user = req.user as User;

    if (user == null) var vistourId = authController.checkCookie(req);

    const postId = req.params.id;

    var thePost =
      await prisma.$queryRaw<Post>`SELECT * FROM posts WHERE id = ${postId} `;

    if (thePost == null) {
      res.status(404).json({
        message: 'invalid post id ',
      });
    }
    if (user != null) {
      var checkIfPostViewed =
        await prisma.$queryRaw`SELECT * FROM post_seen_by WHERE user_id = ${user.id} AND post_id = ${postId};`;
    } else if (vistourId != null) {
      var checkIfPostViewedByVistour =
        await prisma.$queryRaw`SELECT * FROM post_seen_by WHERE vistour_id = ${vistourId} AND post_id = ${postId}`;
    }
    if (
      vistourId != null &&
      checkIfPostViewedByVistour[0] == null &&
      thePost != null
    ) {
      console.log('there is a vistour id and not in the post seen by table');
      var updatedPost =
        await prisma.$queryRaw`UPDATE posts SET views=views +1 WHERE id=${postId} RETURNING *`;
      const id = getUuid();
      await prisma.$queryRaw`
        INSERT INTO post_seen_by (id,vistour_id,post_id) VALUES (${id},
        ${vistourId},${postId})`;
    } else if (
      user != null &&
      user.id != thePost[0].user_id &&
      checkIfPostViewed[0] == null
    ) {
      var updatedPost =
        await prisma.$queryRaw`UPDATE posts SET views=views+1 WHERE id=${postId} RETURNING *`;

      const id = getUuid();
      await prisma.$queryRaw`INSERT INTO post_seen_by (id,user_id,post_id) VALUES (${id},${user.id},${postId})`;
    }

    if (vistourId) {
      res.cookie('session_id', vistourId, { secure: false });
    }
    if (updatedPost != null) {
      res.status(200).json({
        data: updatedPost,
      });
    } else {
      res.status(200).json({
        data: thePost,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const addPost: Handler = async (req, res) => {
  const user = req.user as User;

  const { title, content } = req.body;
  const id = getUuid();
  const newPost =
    await prisma.$queryRaw`INSERT INTO posts (id,title,user_id,content) VALUES (${id},${title},${user.id},${content}) RETURNING *`;

  res.status(201).json({
    message: 'the post added successfully ',
    data: newPost,
  });
};

export const postsUserSaw: Handler = async (req, res) => {
  try {
    const user = req.user as User;

    const posts = await prisma.$queryRaw` SELECT *
    FROM posts left JOIN post_seen_by ON (posts.id = post_seen_by.post_id) where post_seen_by.user_id =${user.id}`;

    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const getPostViewers: Handler = async (req, res) => {
  try {
    const id = req.params.id;
    const viewrs =
      await prisma.$queryRaw` SELECT "users"."firstName","users"."lastName","users"."email","users"."id"
    FROM users INNER JOIN post_seen_by ON (users.id = post_seen_by.user_id) where post_seen_by.post_id =${id}`;

    res.status(200).json({
      data: viewrs,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
