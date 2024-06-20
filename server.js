const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Mongoose schema and model
const postSchema = new mongoose.Schema({
    title: String,
    content: String
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('home', { posts: posts });
    } catch (err) {
        res.send(err);
    }
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.post('/compose', async (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });

    try {
        await post.save();
        res.redirect('/');
    } catch (err) {
        res.send(err);
    }
});

app.get('/posts/:postId', async (req, res) => {
    const requestedPostId = req.params.postId;

    try {
        const post = await Post.findOne({ _id: requestedPostId });
        res.render('post', {
            title: post.title,
            content: post.content,
            createdAt: post.createdAt
        });
    } catch (err) {
        res.send(err);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
