const express = require("express");
const {
  createNote,
  updateNote,
  createComment,
  getNote,
  createTag,
  practice
} = require("../Controllers/PublicController");

const publicRouter = express.Router();

publicRouter.get("/getNote", getNote);
publicRouter.post("/createNote", createNote);
publicRouter.post("/updateNote", updateNote);
publicRouter.post("/createComment", createComment);
publicRouter.post("/createTag", createTag);
publicRouter.post("/practice", practice);

module.exports = publicRouter;
