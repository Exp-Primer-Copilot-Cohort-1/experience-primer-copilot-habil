// Create web server

// Import express
const express = require('express')
// Create router
const router = express.Router()

// Import Comment model
const Comment = require('../models/Comment')

// Import Post model
const Post = require('../models/Post')

// Import User model
const User = require('../models/User')

// Import auth middleware
const auth = require('../middleware/auth')

// Import checkObjectId middleware
const checkObjectId = require('../middleware/checkObjectId')

// @route    POST api/comments
// @desc     Create comment
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id).select('-password')

    // Get post
    const post = await Post.findById(req.body.postId)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // Create comment
    const comment = new Comment({
      text: req.body.text,
      user: req.user.id,
      postId: req.body.postId,
    })

    // Save comment
    await comment.save()

    // Add comment to post
    post.comments.push(comment._id)
    await post.save()

    // Add comment to user
    user.comments.push(comment._id)
    await user.save()

    // Return comment
    res.json(comment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route    GET api/comments
// @desc     Get comments
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    // Get comments
    const comments = await Comment.find().sort({ date: -1 })

    // Return comments
    res.json(comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route    GET api/comments/:id
// @desc     Get comment by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    // Get comment
    const comment = await Comment.findById(req.params.id)

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' })
    }

    // Return comment
    res.json(comment)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
