// const bcrypt = require('bcryptjs');
// const {
//   sequelize,
//   User,
//   CmsPage,
//   Setting,
//   Class,
//   Subject,
//   Teacher,
//   Student
// } = require('../models');

// async function seed() {
//   try {
//     console.log('Syncing database...');
//     await sequelize.sync({ force: true }); // Resets the database and creates tables
//     console.log('Database synced. Seeding default data...');

//     // 1. Seed Super Admin
//     const hashedPassword = await bcrypt.hash('', 10);
//     const adminUser = await User.create({
//       name: 'Super Admin',
//       email: '@school.com',
//       password: hashedPassword,
//       role: 'super_admin',
//       status: 'active'
//     });
//     console.log('Super Admin user created:', adminUser.email);

//     // 2. Seed CMS Pages
//     await CmsPage.bulkCreate([
//       {
//         page_key: 'about',
//         title: 'About Aether Academy',
//         content: 'Established in 2010, Aether Academy is dedicated to nurturing young minds and fostering excellence. Our holistic approach to education combines academic rigor, creative arts, physical education, and character development to prepare students for a rapidly changing world.'
//       },
//       {
//         page_key: 'services',
//         title: 'School Facilities & Services',
//         content: 'We offer state-of-the-art facilities including modern science and computer laboratories, a fully-stocked library, indoor and outdoor sporting arenas, music and art studios, smart classrooms with interactive boards, and transportation facilities.'
//       },
//       {
//         page_key: 'admission_info',
//         title: 'Admissions & Eligibility',
//         content: 'Admissions for the Academic Year 2026-2027 are now open. We welcome applications for Grades 1 through 12. To apply, complete the online Admission Enquiry form. Shortlisted applicants will be invited for an interactive session and entrance evaluation.'
//       }
//     ]);
//     console.log('CMS pages seeded.');

//     // 3. Seed Default Settings
//     await Setting.bulkCreate([
//       { key: 'school_name', value: 'Aether Academy' },
//       { key: 'school_email', value: 'contact@aetheracademy.edu' },
//       { key: 'school_phone', value: '+1 (555) 123-4567' },
//       { key: 'school_address', value: '123 Neon Glow Boulevard, Cyber City' },
//       { key: 'academic_year', value: '2026-2027' }
//     ]);
//     console.log('Settings seeded.');

//     // 4. Seed Mock Data (Classes, Teachers, Students, Subjects) for easier demo
//     const teacherPassword = await bcrypt.hash('teacher123', 10);
//     const studentPassword = await bcrypt.hash('student123', 10);

//     // Create a mock teacher user and profile
//     const teacherUser = await User.create({
//       name: 'Sarah Jenkins',
//       email: '@school.com',
//       password: ,
//       role: 'teacher',
//       status: 'active'
//     });
//     const teacherProfile = await Teacher.create({
//       user_id: teacherUser.id,
//       employee_id: 'EMP001',
//       designation: 'Senior Mathematics Teacher',
//       qualification: 'M.Sc. in Applied Mathematics',
//       joining_date: '2022-08-15',
//       bio: 'Sarah has over 8 years of experience teaching middle and high school math. She believes in making mathematics interactive and fun.'
//     });

//     // Create another mock teacher
//     const teacherUser2 = await User.create({
//       name: 'David Miller',
//       email: '@school.com',
//       password: ,
//       role: 'teacher',
//       status: 'active'
//     });
//     const teacherProfile2 = await Teacher.create({
//       user_id: teacherUser2.id,
//       employee_id: 'EMP002',
//       designation: 'Science Faculty',
//       qualification: 'Ph.D. in Physics',
//       joining_date: '2023-01-10',
//       bio: 'Dr. David is passionate about physical sciences and guides the robotics club at the academy.'
//     });

//     // Create mock classes
//     const class10A = await Class.create({
//       name: 'Grade 10',
//       section: 'A',
//       class_teacher_id: teacherProfile.id,
//       capacity: 30
//     });
//     const class9A = await Class.create({
//       name: 'Grade 9',
//       section: 'A',
//       class_teacher_id: teacherProfile2.id,
//       capacity: 25
//     });

//     // Create mock subjects
//     await Subject.bulkCreate([
//       { name: 'Mathematics', code: 'MATH101', class_id: class10A.id },
//       { name: 'Physics', code: 'PHYS101', class_id: class10A.id },
//       { name: 'Chemistry', code: 'CHEM101', class_id: class10A.id },
//       { name: 'Mathematics', code: 'MATH091', class_id: class9A.id },
//       { name: 'General Science', code: 'SCI091', class_id: class9A.id }
//     ]);

//     // Create mock student user and profile
//     const studentUser = await User.create({
//       name: 'John Doe',
//       email: '@school.com',
//       password: ,
//       role: 'student',
//       status: 'active'
//     });
//     await Student.create({
//       user_id: studentUser.id,
//       admission_no: 'ADM2026001',
//       class_id: class10A.id,
//       section: 'A',
//       dob: '2011-04-12',
//       gender: 'Male',
//       parent_name: 'Robert Doe',
//       parent_contact: '+1 (555) 987-6543',
//       address: '456 Oak Avenue, Cyber City',
//       transport_mode: 'Walking'
//     });

//     console.log('Mock Teachers, Classes, Subjects, and Students seeded successfully!');
//     console.log('Seeding complete!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     process.exit(1);
//   }
// }

// seed();
// New code added to seed.js to create a super admin user, CMS pages, default settings, and mock data for teachers, classes, subjects, and students.

require('dotenv').config();

const bcrypt = require('bcryptjs');

const {
  sequelize,
  User,
  CmsPage,
  Setting,
  Class,
  Subject,
  Teacher,
  Student
} = require('../models');


// ======================================================
// Validate required environment variables
// ======================================================

const requiredEnvVariables = [
  'SUPER_ADMIN_EMAIL',
  'SUPER_ADMIN_PASSWORD',
  'TEACHER_DEFAULT_PASSWORD',
  'STUDENT_DEFAULT_PASSWORD'
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    console.error(`Missing required environment variable: ${variable}`);
    process.exit(1);
  }
}


// ======================================================
// SEED DATABASE
// ======================================================

async function seed() {
  try {

    console.log('========================================');
    console.log('Starting database seed...');
    console.log('========================================');


    // ==================================================
    // WARNING:
    // force:true DROPS existing tables and recreates them.
    // Use this only for development/demo database.
    // ==================================================

    console.log('Syncing database...');

    await sequelize.sync({
      force: true
    });

    console.log('Database synced successfully.');


    // ==================================================
    // 1. SUPER ADMIN
    // ==================================================

    console.log('Creating Super Admin...');

    const adminPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10
    );

    const adminUser = await User.create({
      name: 'Super Admin',

      email: process.env.SUPER_ADMIN_EMAIL,

      password: adminPassword,

      role: 'super_admin',

      status: 'active'
    });

    console.log(
      'Super Admin created:',
      adminUser.email
    );


    // ==================================================
    // 2. CMS PAGES
    // ==================================================

    console.log('Creating CMS pages...');

    await CmsPage.bulkCreate([
      {
        page_key: 'about',

        title: 'About Aether Academy',

        content:
          'Established in 2010, Aether Academy is dedicated to nurturing young minds and fostering excellence. Our holistic approach to education combines academic rigor, creative arts, physical education, and character development to prepare students for a rapidly changing world.'
      },

      {
        page_key: 'services',

        title: 'School Facilities & Services',

        content:
          'We offer state-of-the-art facilities including modern science and computer laboratories, a fully-stocked library, indoor and outdoor sporting arenas, music and art studios, smart classrooms with interactive boards, and transportation facilities.'
      },

      {
        page_key: 'admission_info',

        title: 'Admissions & Eligibility',

        content:
          'Admissions for the Academic Year 2026-2027 are now open. We welcome applications for Grades 1 through 12. To apply, complete the online Admission Enquiry form. Shortlisted applicants will be invited for an interactive session and entrance evaluation.'
      }
    ]);

    console.log('CMS pages created successfully.');


    // ==================================================
    // 3. SCHOOL SETTINGS
    // ==================================================

    console.log('Creating default school settings...');

    await Setting.bulkCreate([
      {
        key: 'school_name',
        value: 'Aether Academy'
      },

      {
        key: 'school_email',
        value: 'contact@aetheracademy.edu'
      },

      {
        key: 'school_phone',
        value: '+1 (555) 123-4567'
      },

      {
        key: 'school_address',
        value: '123 Neon Glow Boulevard, Cyber City'
      },

      {
        key: 'academic_year',
        value: '2026-2027'
      }
    ]);

    console.log('School settings created successfully.');


    // ==================================================
    // 4. DEFAULT PASSWORDS
    // ==================================================

    const teacherPassword = await bcrypt.hash(
      process.env.TEACHER_DEFAULT_PASSWORD,
      10
    );

    const studentPassword = await bcrypt.hash(
      process.env.STUDENT_DEFAULT_PASSWORD,
      10
    );


    // ==================================================
    // 5. TEACHER 1
    // ==================================================

    console.log('Creating teachers...');

    const teacherUser = await User.create({
      name: 'Sarah Jenkins',

      email: 'ssarah@school.com',

      password: teacherPassword,

      role: 'teacher',

      status: 'active'
    });


    const teacherProfile = await Teacher.create({
      user_id: teacherUser.id,

      employee_id: 'EMP001',

      designation: 'Senior Mathematics Teacher',

      qualification: 'M.Sc. in Applied Mathematics',

      joining_date: '2022-08-15',

      bio:
        'Sarah has over 8 years of experience teaching middle and high school math. She believes in making mathematics interactive and fun.'
    });


    // ==================================================
    // 6. TEACHER 2
    // ==================================================

    const teacherUser2 = await User.create({
      name: 'David Miller',

      email: 'ddavid@school.com',

      password: teacherPassword,

      role: 'teacher',

      status: 'active'
    });


    const teacherProfile2 = await Teacher.create({
      user_id: teacherUser2.id,

      employee_id: 'EMP002',

      designation: 'Science Faculty',

      qualification: 'Ph.D. in Physics',

      joining_date: '2023-01-10',

      bio:
        'Dr. David is passionate about physical sciences and guides the robotics club at the academy.'
    });

    console.log('Teachers created successfully.');


    // ==================================================
    // 7. CLASSES
    // ==================================================

    console.log('Creating classes...');

    const class10A = await Class.create({
      name: 'Grade 10',

      section: 'A',

      class_teacher_id: teacherProfile.id,

      capacity: 30
    });


    const class9A = await Class.create({
      name: 'Grade 9',

      section: 'A',

      class_teacher_id: teacherProfile2.id,

      capacity: 25
    });

    console.log('Classes created successfully.');


    // ==================================================
    // 8. SUBJECTS
    // ==================================================

    console.log('Creating subjects...');

    await Subject.bulkCreate([
      {
        name: 'Mathematics',
        code: 'MATH101',
        class_id: class10A.id
      },

      {
        name: 'Physics',
        code: 'PHYS101',
        class_id: class10A.id
      },

      {
        name: 'Chemistry',
        code: 'CHEM101',
        class_id: class10A.id
      },

      {
        name: 'Mathematics',
        code: 'MATH091',
        class_id: class9A.id
      },

      {
        name: 'General Science',
        code: 'SCI091',
        class_id: class9A.id
      }
    ]);

    console.log('Subjects created successfully.');


    // ==================================================
    // 9. STUDENT
    // ==================================================

    console.log('Creating student...');

    const studentUser = await User.create({
      name: 'John Doe',

      email: 'sstudent@school.com',

      password: studentPassword,

      role: 'student',

      status: 'active'
    });


    await Student.create({
      user_id: studentUser.id,

      admission_no: 'ADM2026001',

      class_id: class10A.id,

      section: 'A',

      dob: '2011-04-12',

      gender: 'Male',

      parent_name: 'Robert Doe',

      parent_contact: '+1 (555) 987-6543',

      address: '456 Oak Avenue, Cyber City',

      transport_mode: 'Walking'
    });

    console.log('Student created successfully.');


    // ==================================================
    // COMPLETE
    // ==================================================

    console.log('');
    console.log('========================================');
    console.log('DATABASE SEED COMPLETED SUCCESSFULLY');
    console.log('========================================');

    console.log(
      `Super Admin Email: ${process.env.SUPER_ADMIN_EMAIL}`
    );

    console.log('Default teacher and student accounts created.');

    // Password intentionally NOT printed

    process.exit(0);

  } catch (error) {

    console.error('');
    console.error('========================================');
    console.error('DATABASE SEED FAILED');
    console.error('========================================');

    console.error(error);

    process.exit(1);
  }
}


seed();