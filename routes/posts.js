const router = require('express').Router();
const { verify } = require('./verifyToken');

const Post = require('../models/Post')


router.post('/', verify, async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:postId', async (req, res) => {
    const post = await Post.findById(req.params.postId);
    res.json(post);
});

router.delete('/:postId', async (req, res) => {
    const post = await Post.remove({ _id: req.params.postId });
    res.json(post);
});

router.patch('/:postId', async (req, res) => {
    const post = await Post.updateOne(
        { _id: req.params.postId },
        {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }
    );
    res.json(post);
});

router.get('/', async (req, res) => {
    const posts = await Post.find();
    try {
        const results = { 'results': (posts) ? posts : null };
        res.render('pages/posts', results);
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});


module.exports = router;