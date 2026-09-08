const bcrypt = require('bcryptjs');
const { Teacher, User, Class } = require('../models');

const getAllTeachers = async () => {
  return Teacher.findAll({
    include: [
      { model: User, attributes: ['name', 'email', 'status', 'profile_image'] }
    ]
  });
};

const getTeacherById = async (id) => {
  const teacher = await Teacher.findByPk(id, {
    include: [
      { model: User, attributes: ['name', 'email', 'status', 'profile_image'] },
      { model: Class } // Classes where this teacher is class teacher
    ]
  });
  if (!teacher) {
    throw { status: 404, message: 'Teacher not found.' };
  }
  return teacher;
};

const createTeacher = async (teacherData) => {
  const hashedPassword = await bcrypt.hash('teacher123', 10);
  
  // Create User
  const user = await User.create({
    name: teacherData.name,
    email: teacherData.email,
    password: hashedPassword,
    role: 'teacher',
    status: 'active'
  });

  // Create Teacher profile
  const teacher = await Teacher.create({
    user_id: user.id,
    employee_id: teacherData.employee_id || `EMP${Date.now().toString().slice(-6)}`,
    designation: teacherData.designation,
    qualification: teacherData.qualification,
    joining_date: teacherData.joining_date,
    bio: teacherData.bio
  });

  return getTeacherById(teacher.id);
};

const updateTeacher = async (id, updateData) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) {
    throw { status: 404, message: 'Teacher not found.' };
  }

  await teacher.update({
    designation: updateData.designation,
    qualification: updateData.qualification,
    joining_date: updateData.joining_date,
    bio: updateData.bio
  });

  if (updateData.name || updateData.email || updateData.status) {
    const user = await User.findByPk(teacher.user_id);
    if (user) {
      if (updateData.name) user.name = updateData.name;
      if (updateData.email) user.email = updateData.email;
      if (updateData.status) user.status = updateData.status;
      await user.save();
    }
  }

  return getTeacherById(id);
};

const deleteTeacher = async (id) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) {
    throw { status: 404, message: 'Teacher not found.' };
  }

  const user = await User.findByPk(teacher.user_id);
  if (user) {
    await user.update({ status: 'inactive' });
  }

  return { message: 'Teacher deactivated successfully.' };
};

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
};
