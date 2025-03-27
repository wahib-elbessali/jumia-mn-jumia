const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const { verifyToken, verifyAdmin } = require('./jwtMiddleware');

router.post('/register', verifyToken, verifyAdmin, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ username, email, password, role: 'admin' });
    await user.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Fetch all subcategories
router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a new category
router.post('/categories', verifyToken, verifyAdmin, async (req, res) => {
  const { name, image } = req.body;

  try {
    const category = new Category({ name, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a new subcategory
router.post('/subcategories', verifyToken, verifyAdmin, async (req, res) => {
  const { name, image, categoryId } = req.body;

  try {
    const subcategory = new Subcategory({ name, image, category: categoryId });
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete associated subcategories
    await Subcategory.deleteMany({ category: category._id });
    
    // Delete the category
    await Category.deleteOne({ _id: category._id });
    
    res.json({ message: 'Category and associated subcategories deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a subcategory
router.delete('/subcategories/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    await Subcategory.deleteOne({ _id: subcategory._id });
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;