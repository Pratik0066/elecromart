import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/Product.js';

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Calculate Average Rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get all products (with pagination, search, filters & sorting)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: { $regex: req.query.brand, $options: 'i' } } : {};

  let priceFilter = {};
  if (req.query.minPrice || req.query.maxPrice) {
    priceFilter.price = {};
    if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
  }

  let sortOption = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'name': sortOption = { name: 1 }; break;
      default: sortOption = { createdAt: -1 };
    }
  } else {
    sortOption = { createdAt: -1 };
  }

  const filter = { ...keyword, ...category, ...brand, ...priceFilter };
  const count = await Product.countDocuments(filter);

  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');

  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), categories, brands });
});
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get AI-based product recommendations (uses OpenAI if available)
// @route   GET /api/products/:id/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let recommendations = [];

  // Try OpenAI if API key is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Given a product named "${product.name}" in category "${product.category}" with description "${product.description}", suggest product attributes that would be complementary or similar. Return only a JSON array of up to 3 keywords.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
      });

      const text = completion.choices[0]?.message?.content || '';
      const keywords = text.match(/\b\w{4,}\b/g) || [];

      recommendations = await Product.find({
        _id: { $ne: product._id },
        $or: [
          { name: { $regex: keywords.join('|'), $options: 'i' } },
          { description: { $regex: keywords.join('|'), $options: 'i' } },
        ],
      }).limit(4);
    } catch (err) {
      console.warn('OpenAI recommendation failed, falling back to category match');
    }
  }

  // Fallback: same category, exclude current, limit 4
  if (recommendations.length === 0) {
    recommendations = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);
  }

  res.json(recommendations);
});
// @desc    AI Chat search for products (uses OpenAI if available)
// @route   POST /api/products/chat
const getChatResponse = asyncHandler(async (req, res) => {
  const { message } = req.body;

  let reply = '';
  let products = [];

  // Try OpenAI if API key is configured
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const allProducts = await Product.find({}).select('name category brand price rating').limit(50);
      const catalog = allProducts.map(p => `${p.name} (${p.category}, ${p.brand}, ₹${p.price})`).join('\n');

      const prompt = `You are a shopping assistant. A user asks: "${message}". From this catalog:\n${catalog}\nRecommend up to 3 products that best match. Return a JSON object with "reply" (a friendly 1-sentence answer) and "product_names" (array of exact product names from the catalog).`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
      reply = parsed.reply || '';
      const productNames = parsed.product_names || [];

      if (productNames.length > 0) {
        products = await Product.find({ name: { $in: productNames } }).limit(3);
      }
    } catch (err) {
      console.warn('OpenAI chat failed, falling back to keyword search');
    }
  }

  // Fallback: keyword search
  if (products.length === 0) {
    const keywords = message.split(' ').filter(word => word.length > 3);
    products = await Product.find({
      $or: [
        { name: { $regex: keywords.join('|'), $options: 'i' } },
        { category: { $regex: keywords.join('|'), $options: 'i' } },
        { brand: { $regex: keywords.join('|'), $options: 'i' } },
      ],
    }).limit(3);
  }

  if (!reply) {
    reply = products.length > 0
      ? `I found ${products.length} products that match your request!`
      : "I couldn't find an exact match, but check out our latest electronics collection!";
  }

  res.json({ reply, products });
});

export {
  updateProduct,
  deleteProduct,
  createProduct,
  getChatResponse,
  getProductById,
  getProducts,
  createProductReview,
  getRecommendations
};