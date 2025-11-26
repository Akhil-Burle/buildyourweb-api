const Post = require("../models/postModel");
// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
// const AppError = require("../utils/appError");

// exports.aliasTopPosts = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
//   next();
// };

exports.setPostUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post, { path: "comments" });
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);

// exports.getPostStats = catchAsync(async (req, res, next) => {
//   const stats = await Post.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } },
//     },
//     {
//       $group: {
//         _id: { $toUpper: "$difficulty" },
//         numPosts: { $sum: 1 },
//         numRatings: { $sum: "$likesQuantity" },
//         avgRating: { $avg: "$ratingsAverage" },
//         avgPrice: { $avg: "$price" },
//         minPrice: { $min: "$price" },
//         maxPrice: { $max: "$price" },
//       },
//     },
//     {
//       $sort: { avgPrice: 1 },
//     },
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       stats,
//     },
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // 2021

//   const plan = await Post.aggregate([
//     {
//       $unwind: "$startDates",
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: "$startDates" },
//         numPostStarts: { $sum: 1 },
//         posts: { $push: "$name" },
//       },
//     },
//     {
//       $addFields: { month: "$_id" },
//     },
//     {
//       $project: {
//         _id: 0,
//       },
//     },
//     {
//       $sort: { numPostStarts: -1 },
//     },
//     {
//       $limit: 12,
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       plan,
//     },
//   });
// });

// // /posts-within/:distance/center/:latlng/unit/:unit
// // /posts-within/233/center/34.111745,-118.113491/unit/mi
// exports.getPostsWithin = catchAsync(async (req, res, next) => {
//   const { distance, latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(",");

//   const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         "Please provide latitutr and longitude in the format lat,lng.",
//         400
//       )
//     );
//   }

//   const posts = await Post.find({
//     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     status: "success",
//     results: posts.length,
//     data: {
//       data: posts,
//     },
//   });
// });

// exports.getDistances = catchAsync(async (req, res, next) => {
//   const { latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(",");

//   const multiplier = unit === "mi" ? 0.000621371 : 0.001;

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         "Please provide latitutr and longitude in the format lat,lng.",
//         400
//       )
//     );
//   }

//   const distances = await Post.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: [lng * 1, lat * 1],
//         },
//         distanceField: "distance",
//         distanceMultiplier: multiplier,
//       },
//     },
//     {
//       $project: {
//         distance: 1,
//         name: 1,
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       data: distances,
//     },
//   });
// });
