const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const {v4: uuidv4} = require('uuid');   //for create unique id 
const methodOverride = require("method-override");   //package for sending PATCH | PUT | DELETE request 

app.use(express.urlencoded({extended: true}));   //to parse client data into express understable language
app.use(express.static(path.join(__dirname, "public")));  //set path of public folder
app.use(methodOverride("_method"));    //_method = PATCH | PUT | DELETE whatever request comes it is override

app.set("view engine", "ejs");    //set path of ejs
app.set("views", path.join(__dirname, "views"));  //set path of views folder 

app.listen(port, () => {
    console.log("listening for request");
});

//create posts data using array because we don't have database
let posts = [
    {
        id: uuidv4(),
        username: "Ravina",
        content: "I love coding!"
    },
    {
        id: uuidv4(),
        username: "Vishva",
        content: "I am in 10th class!"
    },
    {
        id: uuidv4(),
        username: "Shyam",
        content: "I am 7 years old!"
    },
];

//view all posts
app.get("/posts", (req, res) => {
    res.render("index.ejs", {posts});  //posts is for data
});

//create new post
app.get("/posts/new", (req,res) => {
    res.render("new.ejs");      //for create new post
});

app.post("/posts", (req, res) => {    //add new post in array
    let {username, content} = req.body;
    console.log(req.body);
    let id = uuidv4();
    posts.push({id, username, content});
    res.redirect("/posts");
});

//retrive only selected post data
app.get("/posts/:id", (req,res) => {   //for retrive only oe post according to it's id
    let {id} = req.params; //here id is that id which user give request & p is that id which is in post array
    let post = posts.find((p) => id === p.id);  //id which is come as request if similar to posts id then it return post 
    if(post){
        res.render("show.ejs", {post});
    }else{
        res.render("error.ejs");
    }    
});

//update post
app.patch("/posts/:id", (req,res) => {
    let {id} = req.params;   //extrect id which user give request
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);  //find post
    post.content = newContent;      //update content
    console.log(post);
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req,res) => {
    let {id} = req.params;   //extrect id
    let post = posts.find((p) => id === p.id);  //find post
    if(post){
        res.render("edit.ejs", {post});
    }else{
        res.render("error.ejs");
    }  
});

//delete post
app.delete("/posts/:id", (req,res) => {
    let {id} = req.params;   //extrect id
    posts = posts.filter((p) => id !== p.id);  //for filter the array expect that id which is deleted
    console.log(posts);
    res.redirect("/posts");
});