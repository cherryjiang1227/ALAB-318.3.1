import express from "express";
const router = express.Router();

import comments from "../data/comments.js";
import error from '../utilities/error.js';

// Part 2: Adding Additional Routes (see routes)
// Your task is to add the following additional routes and any code necessary to make them work as described. The pre-existing routes should remain functional! Assume that you have clients actively using the routes above, so maintaining them is necessary for the health of the application.
// If you do not finish every route below, that is okay! These are for practice purposes, and will not be graded. You should attempt to finish as many as possible in order to better prepare yourself for future projects, assignments, and assessments.
// Create the following routes, using good organizational and coding practices:
// GET /api/users/:id/posts
//  Retrieves all posts by a user with the specified id.
// GET /api/posts?userId=<VALUE>
//  Retrieves all posts by a user with the specified userId.
//  It is common for APIs to have multiple endpoints that accomplish the same task. This route uses a "userId" query parameter to filter posts, while the one above uses a route parameter.
// GET /comments
//  Note that we do not have any comments data yet; that is okay! Make sure that you create a place to store comments, but you do not need to populate that data.router.get("/:id", (req, res) => {
// POST /comments
//  When creating a new comment object, it should have the following fields:
//  id: a unique identifier.
//  userId: the id of the user that created the comment.////
//  postId: the id of the post the comment was made on.
//  body: the text of the comment.
// GET /comments/:id
//  Retrieves the comment with the specified id.
// PATCH /comments/:id
//  Used to update a comment with the specified id with a new body.
// DELETE /comments/:id
//  Used to delete a comment with the specified id.
// GET /comments?userId=<VALUE>
//  Retrieves comments by the user with the specified userId.
// GET /comments?postId=<VALUE>
//  Retrieves comments made on the post with the specified postId.
// GET /posts/:id/comments
//  Retrieves all comments made on the post with the specified id.
// GET /users/:id/comments
//  Retrieves comments made by the user with the specified id.
// GET /posts/:id/comments?userId=<VALUE>
//  Retrieves all comments made on the post with the specified id by a user with the specified userId.
// GET /users/:id/comments?postId=<VALUE>
//  Retrieves comments made by the user with the specified id on the post with the specified postId.
// Quickly, you can begin to see how data is interconnected, leading to difficulties with scaling an application as the categories of data continue to grow. How might we have created this in a way that allows it to scale more easily?
// This illustrates the importance of thinking about how the data will be structured before you begin your journey of creating an API to handle the data.
// For example, could we have created a single piece of middleware to handle all possible filtering via query parameters? Yes, we could have! Now, however, it would require refactoring much of our code in order to do so. If you are up for the challenge (and have the time), feel free to explore this possibility.
router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "comments/:id",
        rel: ":id",
        type: "GET",
      },
    ];
    res.json({ comments, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: comments.length + 1,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };
      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);
    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];
    if (comment) res.json({ comment, links });
    else next();
  })
  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  })
  .delete((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  });

  export default router;