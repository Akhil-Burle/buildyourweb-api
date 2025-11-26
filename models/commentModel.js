// comment / rating / createdAt / ref to post / ref to user
const mongoose = require("mongoose");
const Post = require("./postModel");

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ post: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: "post",
    select: "name",
  }).populate({
    path: "user",
    select: "name photo",
  });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(postId) {
  const stats = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: "$post",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, {
      likesQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      likesQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function() {
  // this points to current comment
  this.constructor.calcAverageRatings(this.post);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.post);
});

const Comment = mongoose.model("Comment", reviewSchema);

module.exports = Comment;
