const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const commentsController = require("../controllers/commentsController");
const businessController = require("../controllers/businessController");
const verifyToken = require("../middleware/verifyToken");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// Login route
router.route("/users/login").get(usersController.checkGet).post(jsonParser, usersController.loginUser);

// Get all users and create new user route
router.route("/users").get(verifyToken, usersController.getAllUsers).post(jsonParser, usersController.createUser);

router.route("/myprofile").get(verifyToken, usersController.getMyProfile);

// Get user by id, update user and delete user route
router.route("/users/:user_id").get(verifyToken, usersController.getUserById).put(verifyToken, jsonParser, usersController.updateUser).delete(verifyToken, usersController.deleteUser);

// Password reset routes
router.route("/password").put(jsonParser, usersController.resetPassword).post(usersController.requestPasswordReset);

// Password reset routes
router.route("/password/:user_id").put(jsonParser, usersController.updatePassword);

// Businesses routes
router.route("/business").get(verifyToken, businessController.getAllBusinesses).post(verifyToken, jsonParser, businessController.createBusiness);

// Get business by id, update business and delete business route
router.route("/business/:business_id").get(verifyToken, businessController.getBusinessById).put(verifyToken, jsonParser, businessController.updateBusiness).delete(verifyToken, businessController.deleteBusiness);

// Get business by user id
router.route("/business/user/:user_id").get(verifyToken, businessController.getBusinessByUserId);

// Get all comments route
router.route("/comments").get(verifyToken, commentsController.getAllComments);

// Get comment ownership route
router.route("/comments/ownership/:comment_id").get(verifyToken, commentsController.getCommentOwnership);

// Get a comment and update a comment route
router.route("/comments/:comment_id").get(verifyToken, commentsController.getCommentByCommentId).put(verifyToken, commentsController.updateComment).delete(verifyToken, commentsController.deleteComment);

// Get comments by business id and create comment route
router.route("/business/:business_id/comments").get(verifyToken, commentsController.getCommentsByBusinessId).post(verifyToken, jsonParser, commentsController.createComment);

// Get comments by user id route
router.route("/users/:user_id/comments").get(verifyToken, commentsController.getCommentsByUserId);

// Get likes by business id and like business route
router.route("/business/:business_id/likes").get(verifyToken, businessController.getLikesByBusinessId).post(verifyToken, businessController.likeBusiness);

// Get is user an admin route
router.route("/admin").get(verifyToken, usersController.getIsAdmin);

module.exports = router;
