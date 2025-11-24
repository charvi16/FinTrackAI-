import User from '../models/User.js';

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// @desc    Set or update monthly budget goal
// @route   POST /api/users/me/goal
// @access  Private
const setBudgetGoal = async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    req.user.monthlyBudget = monthlyBudget;
    await req.user.save();
    res.json({ message: 'Monthly budget updated', monthlyBudget });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set goal' });
  }
};


// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, image } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (image !== undefined) user.image = image;

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated",
      user: {
        ...updatedUser._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export { getMe, updateProfile, setBudgetGoal };
