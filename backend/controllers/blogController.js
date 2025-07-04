import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import main from '../configs/gemini.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

        const imageFile = req.file;

        // Check if all required fields are provided
        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        //upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer, // the file buffer
            fileName: imageFile.originalname, // the name of the file
            folder: "/blogs" // optional folder name
        });
        
        //optimisation through ImageKit URL transformation
        const optimizedImageUrl = imagekit.url({
            path: response.filePath, // the path returned by ImageKit
            transformation: [
                {quality: 'auto'},   //auto compression
                {format: 'webp'}, //convert to modern format
                {width: '1280'} //width resizing
            ]
        });

        const image = optimizedImageUrl;
        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image,
            isPublished
        });
        res.json({ success: true, message: "Blog added successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Function to get all blogs
export const getAllBlogs = async(req,res)=>{
    try{
        const blogs = await Blog.find({isPublished: true}) // Fetch only published blogs
        res.json({success: true, blogs})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

// Function to get blogs by ID
export const getBlogById = async(req,res)=>{
    try{
        const {blogId} = req.params; // Extract blogId from request parameters
        const blog = await Blog.findById(blogId) // individual blog data 
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

//delete blog by ID by admin
export const deleteBlogById = async(req,res)=>{
    try{
        const {id} = req.body;
        await Blog.findByIdAndDelete(id);

        //Delete all comments associated with the blog
        await Comment.deleteMany({blog: id});

        res.json({success: true, message: "Blog deleted successfully"})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

//controller function to publish or unpublish a blog
export const togglePublish = async(req,res)=>{
    try{
        const {id}=req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true,message: "Blog status updated"})

    }catch(error){
        res.json({success: false,message: error.message})
    }
}



export const addComment = async(req,res)=>{
    try{
        const {blog , name , content} = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: "Comment added for review"})
        
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export const getBlogComments = async(req,res)=>{
    try{
        const {blogId} = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments});
    }catch(error){
        res.json({success: false,message: error.message})
    }
}

export const generateContent = async(req,res)=>{
    try{
        const {prompt} = req.body;
        const content = await main(prompt + 'Generate a detailed, well-organised blog content for this topic in simple text format')
        res.json({success: true, content})
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

