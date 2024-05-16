
const express = require('express');

const postController = require('../controllers/postController');

const router = express.Router();

router.route("/").get(postController.getAllPosts).post(postController.createPost);
router.route("/:id")
  .get(postController.getOnePosts)
  .patch(postController.updatePosts)
  .delete(postController.deletePosts)
;

module.exports = router;