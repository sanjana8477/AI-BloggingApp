import express from 'express';
import { addBlog , getAllBlogs, getBlogById, deleteBlogById, togglePublish, addComment, getBlogComments, generateContent } from '../controllers/blogController.js';
import upload from '../middlewares/multer.js';
import auth from '../middlewares/auth.js';

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog); // Route to add a new blog post
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth , deleteBlogById);  //only admin can delete a blog
blogRouter.post("/toggle-publish", auth ,togglePublish);

blogRouter.post("/add-comment", addComment); 
blogRouter.post("/comments", getBlogComments); 
blogRouter.post("/generate", auth, generateContent);


export default blogRouter;