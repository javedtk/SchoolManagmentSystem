const bcrypt = require('bcryptjs');
const { Student, User, Class } = require('../models');
const emailService = require('./email.service');

const getAllStudents = async (query = {}) => {
  const where = {};
  if (query.class_id) {
    where.class_id = query.class_id;
  }
  if (query.section) {
    where.section = query.section;
  }
  return Student.findAll({
    where,
    include: [
      { model: User, attributes: ['name', 'email', 'status', 'profile_image'] },
      { model: Class, attributes: ['name', 'section'] }
    ]
  });
};

const getStudentById = async (id) => {
  const student = await Student.findByPk(id, {
    include: [
      { model: User, attributes: ['name', 'email', 'status', 'profile_image'] },
      { model: Class }
    ]
  });
  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }
  return student;
};

const createStudent = async (studentData) => {
  // Generate a premium random initial password for the student
  const rawPassword = studentData.password || `Aether@${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  
  // Create base User first
  const user = await User.create({
    name: studentData.name,
    email: studentData.email,
    password: hashedPassword,
    role: 'student',
    status: 'active',
    profile_image: studentData.profile_image || null
  });

  // Create Student profile linked to User
  const student = await Student.create({
    user_id: user.id,
    admission_no: studentData.admission_no || `ADM${Date.now().toString().slice(-6)}`,
    class_id: (studentData.class_id && Number(studentData.class_id) !== 0) ? Number(studentData.class_id) : null,
    section: studentData.section || null,
    dob: studentData.dob || null,
    gender: studentData.gender || null,
    parent_name: studentData.parent_name || null,
    parent_contact: studentData.parent_contact || null,
    address: studentData.address || null,
    transport_mode: studentData.transport_mode || null
  });

  // Send the welcome email with credentials
  await emailService.sendStudentWelcomeEmail(user.email, user.name, rawPassword);

  return getStudentById(student.id);
};

const updateStudent = async (id, updateData) => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }

  // Update Student Profile
  await student.update({
    class_id: (updateData.class_id && Number(updateData.class_id) !== 0) ? Number(updateData.class_id) : null,
    section: updateData.section || null,
    dob: updateData.dob || null,
    gender: updateData.gender || null,
    parent_name: updateData.parent_name || null,
    parent_contact: updateData.parent_contact || null,
    address: updateData.address || null,
    transport_mode: updateData.transport_mode || null
  });

  // Update associated User if needed
  if (updateData.name || updateData.email || updateData.status || updateData.profile_image) {
    const user = await User.findByPk(student.user_id);
    if (user) {
      if (updateData.name) user.name = updateData.name;
      if (updateData.email) user.email = updateData.email;
      if (updateData.status) user.status = updateData.status;
      if (updateData.profile_image) user.profile_image = updateData.profile_image;
      await user.save();
    }
  }

  return getStudentById(id);
};

const deleteStudent = async (id) => {
  const student = await Student.findByPk(id);
  if (!student) {
    throw { status: 404, message: 'Student not found.' };
  }
  
  // Disable user account
  const user = await User.findByPk(student.user_id);
  if (user) {
    await user.update({ status: 'inactive' });
  }

  return { message: 'Student deactivated successfully.' };
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
