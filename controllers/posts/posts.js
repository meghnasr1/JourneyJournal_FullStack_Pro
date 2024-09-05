
const Post= require("../../model/posts/Post");
const User= require("../../model/user/User");
//const { post } = require("../../routes/posts/posts");
const appErr = require("../../utils/appErr");

//create
const createPostCtrl = async (req, res, next) => {
  const {title, description, category, user} =req.body;
  if(!title || !description || !category || !req.file){
        return next(appErr("All fields are required"));
  }
    try {
      // find the user
      const userId= req.session.userAuth;
      const userFound= await User.findById(userId);
      // create the post
      const postCreated= await Post.create({
        title,
        description,
        category ,
        user: userFound._id,
        image : req.file.path,
      });
      // push the post created into the array of user's post
      userFound.posts.push(postCreated._id);
      // resave
      await userFound.save();
      res.json({
        status: "success",
        data : postCreated,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
  //all
  const fetchPostsCtrl = async (req, res, next) => {
    try {
      const posts = await Post.find().populate('comments');
      res.json({
        status: "success",
        data : posts,
      });
    } catch (error) {
      return next(appErr(error.message));
    }
  };
  
  //details
  const fetchPostCtrl = async (req, res,next) => {
    try {
      // get id from params
      const id= req.params.id;
      // find the post;
      const post = await Post.findById(id).populate('comments');
      res.json({
        status: "success",
        data : post,
      });
    } catch (error) {
      return next(appErr(error.message));
    }
  };
  
  //delete
  const deletePostCtrl = async (req, res, next) => {
    try {
      // // find the post
      // const post =await Post.findById(req.param.id);
      // Validate user authentication
    if (!req.session.userAuth) {
      return next(appErr("User not authenticated", 401));
    }

    // Find the post
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return next(appErr("Post not found", 404));
    }

      // check if the post belongs to the user
      if(post.user.toString() !== req.session.userAuth.toString()){
        return next(appErr("You are not allowed to delete this post", 403));
      }
      // delete a post
      await Post.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        data: "Post has been deleted successfully",
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
  //update
  const updatepostCtrl = async (req, res, next) => {
    const {title, description, category} =req.body;

    try {
      if (!req.session.userAuth) {
        return next(appErr("User not authenticated", 401));
      }
  
      // Find the post
      const post = await Post.findById(req.params.id);
  
      // Check if post exists
      if (!post) {
        return next(appErr("Post not found", 404));
      }
  
        // check if the post belongs to the user
        if(post.user.toString() !== req.session.userAuth.toString()){
          return next(appErr("You are not allowed to update this post", 403));
        }
        // update
        const postUpdated = await Post.findByIdAndUpdate(req.params.id,{
          title,
          description,
          category,
          image: req.file.path
       },{
        new : true,
       });
      res.json({
        status: "success",
        data: postUpdated,
      });
    } catch (error) {
      res.json(error);
    }
  };
  module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatepostCtrl,
  };
  