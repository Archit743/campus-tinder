const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Like = require('../models/Like');
const Match = require('../models/Match');
const Message = require('../models/Message');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, college, age, bio, interests, image } = req.body;
  if (!name || !email || !password || !college || !age) {
    return res.status(400).json({ message: 'Name, email, password, college, and age are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      college,
      age: parseInt(age),
      bio: bio || '',
      interests: interests ? interests.split(',').map(i => i.trim()).filter(i => i) : [],
      image: image || '',
    });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Signin successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected Profile Route
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Users for Swiping
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Find users not yet liked or matched
    const likes = await Like.find({ liker: req.user.userId }).select('liked');
    const matches = await Match.find({
      $or: [{ user1: req.user.userId }, { user2: req.user.userId }],
    }).select('user1 user2');

    const excludedIds = [
      ...likes.map(like => like.liked),
      ...matches.map(match => match.user1.toString() === req.user.userId ? match.user2 : match.user1),
      req.user.userId,
    ];

    const users = await User.find({ _id: { $nin: excludedIds } }).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create Like (and potentially a Match)
router.post('/matches', authenticateToken, async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const likedUser = await User.findById(userId);
    if (!likedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ liker: req.user.userId, liked: userId });
    if (existingLike) {
      return res.status(400).json({ message: 'Already liked this user' });
    }

    // Check if already matched
    const existingMatch = await Match.findOne({
      $or: [
        { user1: req.user.userId, user2: userId },
        { user1: userId, user2: req.user.userId },
      ],
    });
    if (existingMatch) {
      return res.status(400).json({ message: 'Match already exists' });
    }

    // Create like
    const like = new Like({
      liker: req.user.userId,
      liked: userId,
    });
    await like.save();

    // Check for mutual like
    const mutualLike = await Like.findOne({ liker: userId, liked: req.user.userId });
    if (mutualLike) {
      const match = new Match({
        user1: req.user.userId,
        user2: userId,
      });
      await match.save();
      return res.status(201).json({ isMatch: true, message: 'Match created' });
    }

    res.status(200).json({ isMatch: false, message: 'Like recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Matches
router.get('/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.user.userId }, { user2: req.user.userId }],
    }).populate('user1 user2');

    const formattedMatches = await Promise.all(matches.map(async match => {
      const otherUser = match.user1._id.toString() === req.user.userId ? match.user2 : match.user1;
      // Fetch latest message
      const latestMessage = await Message.findOne({ matchId: match._id })
        .sort('-timestamp')
        .limit(1);
      return {
        id: otherUser._id,
        name: otherUser.name,
        image: otherUser.image,
        lastMessage: latestMessage ? latestMessage.content : '',
        timestamp: latestMessage ? latestMessage.timestamp.toISOString() : match.createdAt.toISOString(),
      };
    }));

    res.status(200).json({ matches: formattedMatches });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send Message
router.post('/messages', authenticateToken, async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) {
    return res.status(400).json({ message: 'Receiver ID and content are required' });
  }

  try {
    const match = await Match.findOne({
      $or: [
        { user1: req.user.userId, user2: receiverId },
        { user1: receiverId, user2: req.user.userId },
      ],
    });

    if (!match) {
      return res.status(400).json({ message: 'No match found' });
    }

    const message = new Message({
      matchId: match._id,
      sender: req.user.userId,
      receiver: receiverId,
      content,
    });
    await message.save();

    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Messages for a Match
router.get('/messages/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const match = await Match.findOne({
      $or: [
        { user1: req.user.userId, user2: userId },
        { user1: userId, user2: req.user.userId },
      ],
    });

    if (!match) {
      return res.status(400).json({ message: 'No match found' });
    }

    const messages = await Message.find({ matchId: match._id })
      .sort('timestamp')
      .populate('sender receiver');
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      sender: msg.sender._id.toString(),
      receiver: msg.receiver._id.toString(),
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;