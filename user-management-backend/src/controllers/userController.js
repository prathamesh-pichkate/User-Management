const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');
const { Parser } = require('json2csv');

/**
 * Get all users with pagination and search
 * GET /api/users?page=1&limit=10&search=keyword
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    
    // Get users with pagination
    const users = await User.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers: totalUsers,
        limit: limit
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user by ID
 * GET /api/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user
 * POST /api/users
 */
exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;

    // Upload profile image to Cloudinary if provided
    let profileImageUrl = '';
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      location,
      profileImage: profileImageUrl
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 * PUT /api/users/:id
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Upload new profile image if provided
    let profileImageUrl = user.profileImage;
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (user.profileImage) {
        await deleteFromCloudinary(user.profileImage);
      }
      profileImageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Update user
    user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        location,
        profileImage: profileImageUrl
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete profile image from Cloudinary if exists
    if (user.profileImage) {
      await deleteFromCloudinary(user.profileImage);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Export users to CSV
 * GET /api/users/export/csv
 */
exports.exportToCSV = async (req, res, next) => {
  try {
    // Get all users
    const users = await User.find().sort({ createdAt: -1 });

    // Define CSV fields
    const fields = [
      { label: 'ID', value: '_id' },
      { label: 'First Name', value: 'firstName' },
      { label: 'Last Name', value: 'lastName' },
      { label: 'Email', value: 'email' },
      { label: 'Mobile', value: 'mobile' },
      { label: 'Gender', value: 'gender' },
      { label: 'Status', value: 'status' },
      { label: 'Location', value: 'location' },
      { label: 'Profile Image', value: 'profileImage' },
      { label: 'Created At', value: 'createdAt' }
    ];

    // Convert to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(users);

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};