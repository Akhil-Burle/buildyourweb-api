const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const reviewRouter = require("./commentRoutes");

const router = express.Router();

// router.param('id', postController.checkID);

// POST /post/234fad4/comments
// GET /post/234fad4/comments

router.use("/:postId/comments", reviewRouter);

// router
//   .route("/top-5-cheap")
//   .get(postController.aliasTopPosts, postController.getAllPosts);

// router.route("/post-stats").get(postController.getPostStats);
// router
//   .route("/monthly-plan/:year")
//   .get(
//     authController.protect,
//     authController.restrictTo("admin", "lead-guide", "guide"),
//     postController.getMonthlyPlan
//   );

// router
//   .route("/posts-within/:distance/center/:latlng/unit/:unit")
//   .get(postController.getPostsWithin);
// // /posts-within?distance=233&center=-40,45&unit=mi
// // /posts-within/233/center/-40,45/unit/mi

// router.route("/distances/:latlng/unit/:unit").get(postController.getDistances);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    postController.setPostUserIds,
    authController.restrictTo("user", "admin", "lead-guide"),
    postController.createPost
  );

router
  .route("/:id")
  .get(postController.getPost)
  .patch(
    authController.protect,

    authController.restrictTo("admin", "lead-guide"),
    postController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    postController.deletePost
  );

module.exports = router;
