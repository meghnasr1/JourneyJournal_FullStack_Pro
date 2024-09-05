const Post=require("../../model/posts/Post");
const User=require("../../model/user/User");
const Comment=require("../../model/comment/Comment");
const appErr = require("../../utils/appErr");


//create
const createCommentCtrl = async (req, res, next) => {
  const {message}=req.body;
    try {
      // fid the post
      const post= await Post.findById(req.params.id);
      // create the comment
      const comment= await Comment.create({
        user : req.session.userAuth,
        message,
      });
      // push the comment to post
      post.comments.push(comment._id);
      // find the user
      const user= await User.findById(req.session.userAuth);
      // push comment into user
      user.comments.push(comment._id);
      // disable validation
      // save
      await post.save({validateBeforeSave : false});
      await user.save({validateBeforeSave : false});
      res.json({
        status: "success",
        data : comment,
      });
    } catch (error) {
      next(appErr(error));
    }
  };
  
  //single
  const commentDetailsCtrl = async (req, res, next) => {
    try {
      res.json({
        status: "success",
        user: "Post comments",
      });
    } catch (error) {
      next(appErr(error));
    }
  };
  
  //delete
  const deleteCommentCtrl = async (req, res, next) => {
    try {
    if (!req.session.userAuth) {
      return next(appErr("User not authenticated", 401));
    }

    // Find the comment
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) {
      return next(appErr("Comment not found", 404));
    }

      // check if the comments belongs to the user
      if(comment.user.toString() !== req.session.userAuth.toString()){
        return next(appErr("You are not allowed to delete this comment", 403));
      }
      // delete a post
      await Comment.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        data: "Comment has been deleted successfully",
      });
    } catch (error) {
      next(appErr(error));
    }
  };
  
  //Update
  const upddateCommentCtrl = async (req, res, next) => {
    try {
      if (!req.session.userAuth) {
        return next(appErr("User not authenticated", 401));
      }
  
      // Find the comment
      const  comment= await Comment.findById(req.params.id);
  
      //Check if comment exists
      if (!comment) {
        return next(appErr("Comment not found", 404));
      }
  
        // check if the comment belongs to the user
        if(comment.user.toString() !== req.session.userAuth.toString()){
          return next(appErr("You are not allowed to update this comment", 403));
        }
        // update
        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id,
          {
          message : req.body.message,
       },
       {
        new : true
       });
      res.json({
        status: "success",
        data: commentUpdated,
      });
    } catch (error) {
       next(appErr(error));
    }
  };
  
  module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    upddateCommentCtrl,
  };
  