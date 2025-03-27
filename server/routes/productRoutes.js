const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const { verifyToken, verifyAdmin } = require('./jwtMiddleware');

// Create product
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('subcategory')
      .populate('ratings.user')
      .populate('comments.user');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('subcategory')
      .populate('ratings.user')
      .populate('comments.user');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/subcategory/:id', async (req, res) => {
  try {
    const products = await Product.find({ subcategory: req.params.id })
      .populate('category')
      .populate('subcategory');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add Rating
router.post('/:id/rate', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const existingRating = product.ratings.find(r => r.user.toString() === req.user.id);
    
    if (existingRating) {
      existingRating.value = req.body.rating;
    } else {
      product.ratings.push({ user: req.user.id, value: req.body.rating });
    }
    
    product.averageRating = product.ratings.reduce((sum, r) => sum + r.value, 0) / product.ratings.length;
    await product.save();

    // Get updated product with populated data
    const updatedProduct = await Product.findById(req.params.id)
      .populate('ratings.user')
      .populate('comments.user');

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error saving rating' });
  }
});

// Add comment
router.post('/:id/comment', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.comments.push({
      user: req.user.id,
      text: req.body.text
    });
    
    await product.save();

    // Get updated product with populated data
    const updatedProduct = await Product.findById(req.params.id)
      .populate('ratings.user')
      .populate('comments.user');

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error saving comment' });
  }
});


// Update product (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('category')
      .populate('subcategory')
      .populate('ratings.user')
      .populate('comments.user');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;