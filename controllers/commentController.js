const Comment = require("../models/commentModel");
const factory = require("./handlerFactory");
// const catchAsync = require('./../utils/catchAsync');

exports.setPostUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Comment);
exports.getReview = factory.getOne(Comment);
exports.createReview = factory.createOne(Comment);
exports.updateReview = factory.updateOne(Comment);
exports.deleteReview = factory.deleteOne(Comment);
