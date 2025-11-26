const mongoose = require("mongoose");
// const slugify = require("slugify");
// const User = require('./userModel');
// const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
    tags: {
      type: [String],
      required: [true, "A post must have tags"],
      // enum: {
      //   values: ["easy", "medium", "difficult"],
      //   message: "Tags are either: easy, medium, difficult",
      // },
    },
    likesQuantity: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      trim: true,
      required: [true, "A post must have a description"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretPost: {
      type: Boolean,
      default: false,
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

// postSchema.index({ price: 1 });
postSchema.index({ price: 1, ratingsAverage: -1 });
postSchema.index({ slug: 1 });
postSchema.index({ startLocation: "2dsphere" });

postSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

// Virtual populate
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// postSchema.pre("save", function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// QUERY MIDDLEWARE
// postSchema.pre('find', function(next) {
postSchema.pre(/^find/, function(next) {
  this.find({ secretPost: { $ne: true } });

  this.start = Date.now();
  next();
});

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

postSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// postSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretPost: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
