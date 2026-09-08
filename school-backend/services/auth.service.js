const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Teacher, Class } = require('../models');
const env = require('../config/env');

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  if (user.status !== 'active') {
    throw { status: 403, message: 'Your account is inactive. Please contact the administrator.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw { status: 401, message: 'Invalid email or password.' };
  }

  let profile = null;
  if (user.role === 'teacher') {
    profile = await Teacher.findOne({ where: { user_id: user.id } });
  } else if (user.role === 'student') {
    profile = await Student.findOne({
      where: { user_id: user.id },
      include: [{ model: Class, attributes: ['name', 'section'] }]
    });
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    profileId: profile ? profile.id : null
  };

  const token = jwt.sign(tokenPayload, env.jwt.secret, {
    expiresIn: env.jwt.expiry
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image
    },
    profile
  };
};

const getProfile = async (userId, role) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  if (!user) {
    throw { status: 404, message: 'User not found.' };
  }

  let profile = null;
  if (role === 'teacher') {
    profile = await Teacher.findOne({ where: { user_id: userId } });
  } else if (role === 'student') {
    profile = await Student.findOne({
      where: { user_id: userId },
      include: [{ model: Class }]
    });
  }

  return { user, profile };
};

const updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw { status: 404, message: 'User not found.' };
  }

  // Update user base fields
  if (updateData.name) user.name = updateData.name;
  if (updateData.profile_image) user.profile_image = updateData.profile_image;
  await user.save();

  // Update profile fields
  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ where: { user_id: userId } });
    if (teacher) {
      if (updateData.bio) teacher.bio = updateData.bio;
      await teacher.save();
    }
  } else if (user.role === 'student') {
    const student = await Student.findOne({ where: { user_id: userId } });
    if (student) {
      if (updateData.parent_contact) student.parent_contact = updateData.parent_contact;
      if (updateData.address) student.address = updateData.address;
      await student.save();
    }
  }

  return getProfile(userId, user.role);
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw { status: 404, message: 'User not found.' };
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw { status: 400, message: 'Incorrect current password.' };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: 'Password updated successfully.' };
};

module.exports = {
  login,
  getProfile,
  updateProfile,
  changePassword
};
