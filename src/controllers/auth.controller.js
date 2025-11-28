import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "keyboardcat";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

function signAccess(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}

function signRefresh(user) {
  return jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });
}

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password -refreshToken").lean();

    res.json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const user = await User.create({ name, email, password, role });

    const token = signAccess(user);
    const refreshToken = signRefresh(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signAccess(user);
    const refreshToken = signRefresh(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//REFRESH TOKEN
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token provided" });

    const payload = jwt.verify(refreshToken, REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    const token = signAccess(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token provided" });

    const payload = jwt.verify(refreshToken, REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid token" });
  }
};

//  Update
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // from your authMiddleware
    const { name } = req.body;

    const updates = {};
    if (name) updates.name = name;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
