Product Requirements Document (PRD)
School Management System (SMS)
---
1. Project Overview
Project Name: School Management System (SMS)
Tech Stack: Node.js, Express.js, Sequelize ORM, MySQL, AngularJS (Angular)
Database Name: schldbdev001
1.1 Purpose
A full-featured School Management System with a dynamic public-facing website (managed via Super Admin) and three role-based dashboards: Super Admin, Teacher, and Student.
1.2 Goals
Provide a dynamic, CMS-style public website where content (Classes, Faculty, Admission, Events, Achievements, Gallery, Career) is fully manageable by Super Admin.
Provide role-based dashboards for Super Admin, Teacher, and Student.
Manage academic operations: attendance, results, timetable, assignments, fees, admissions, and job recruitment.
Send email notifications (admissions, fee receipts, results, job applications) via configured SMTP.
---
2. Configuration Details
2.1 Email Configuration (SMTP - Nodemailer)
```
EMAIL_HOST: smtp.gmail.com
EMAIL_PORT: 587
EMAIL_USER: junednite@gmail.com
EMAIL_APP_PASSWORD: dhbl vllw bvjl sqnf
EMAIL_SECURE: false
```
2.2 Database Configuration (MySQL + Sequelize)
```
DB_NAME: schldbdev001
DB_HOST: localhost
DB_PORT: 3306
DB_USERNAME: root
DB_PASSWORD: root
DB_DIALECT: mysql
```
---
3. User Roles & Access
Role	Description
Super Admin	Full system access, manages all modules and content
Teacher	Manages assigned class/subject academic data
Student	Views own academic info, pays fees
---
4. Public Website (Landing Site) Requirements
4.1 Pages
Home Page – Hero banner, highlights, quick links, latest events/achievements (dynamic feed)
About Us – School info, vision, mission, history (CMS-managed static content block)
Classes Page (Dynamic) – List of classes with sections, capacity, description, fee structure, subjects offered — managed by Admin via "Manage Classes"
Services Page – List of school services/facilities (CMS-managed)
Faculty Page (Dynamic) – List of teachers with photo, name, designation, qualification, subject, bio — sourced from "Manage Teachers"
Admission Page (Dynamic) – Admission process steps, eligibility, dates, downloadable forms, online admission enquiry form — managed via "Admission Corner"
Contact Us Page – Contact form (sends email), map, address, phone, email
Events Page (Dynamic) – List/calendar of events with images, date, description — sourced from "Manage Events"
Achievements Page (Dynamic) – Student/school achievements with images, year, description — sourced from "Manage Achievements"
Gallery Page (Dynamic) – Image/video galleries categorized by album/event — sourced from "Manage Gallery"
Career Page (Dynamic) – Job openings list + online job application form — sourced from "Manage Jobs"/"Manage Job Applications"
4.2 Dynamic Content Rule
All content marked dynamic must be:
Stored in DB tables
CRUD-manageable from Super Admin Dashboard
Rendered via public APIs (no auth required) consumed by Angular landing components
---
5. Super Admin Dashboard - Modules
#	Module	Key Features
1	Dashboard	Stats cards (total students, teachers, classes, fees collected, pending fees, admissions, applications), charts (enrollment trend, fee collection trend, attendance %, gender ratio), recent activity feed
2	Admission Corner	View/manage admission enquiries, convert enquiry to admitted student, manage admission CMS content (process, dates, eligibility)
3	Manage Fee Receipt	Generate, view, download, email fee receipts (PDF)
4	Manage Teachers	CRUD teacher profiles, assign subjects/classes, credentials
5	Manage Subjects	CRUD subjects, assign to classes
6	Manage Classes	CRUD classes & sections, assign class teacher, link subjects
7	Manage Students	CRUD student profiles, assign to class/section, parent details
8	Manage Events	CRUD events (title, date, description, image) for public site
9	Manage Gallery	CRUD albums and media items
10	Manage Fee	Define fee structure per class, fee categories, due dates, discounts
11	Manage Students	(Same as #7 - covers full student lifecycle)
12	Manage Achievements	CRUD achievements for public site
13	Manage Student Attendance	View/edit attendance across classes, reports
14	Manage Results	Define exam terms, view/override results, publish results
15	Manage Time Table	Create/edit timetable per class/section with periods, subjects, teachers
16	Manage Jobs	CRUD job postings for Career page
17	Manage Job Applications	View applicants, download resumes, update application status
18	Settings	School profile, SMTP config, academic year, system preferences
19	Profile	Admin profile view/edit, change password
20	User Guide	Static/CMS help documentation
---
6. Teacher Dashboard - Modules
#	Module	Key Features
1	Manage Assigned Class	View assigned classes/sections, student list
2	Manage Attendance	Mark daily attendance for assigned class, view history
3	Manage Assignments	Create/edit assignments, upload files, set due dates, view submissions
4	Manage Results	Enter/edit marks for assigned class & subject, view grade summary
5	Manage Events	Add/edit events (subject to admin approval or direct based on permission)
6	Manage Gallery	Upload media to galleries (class/event specific)
7	Settings	Notification preferences, password change
8	Profile	View/edit own profile
9	User Guide	Help documentation
---
7. Student Dashboard - Modules
#	Module	Key Features
1	View Assignment	List of assignments by subject, download attachments, submit work
2	View Attendance	Monthly/overall attendance %, calendar view
3	View Events	List of upcoming/past events
4	View Fee Receipt	List of past receipts, download PDF
5	Pay Due Fee	View pending fees, online payment integration
6	View Result	Term-wise results, grade card download
7	Profile	View/edit profile, parent info
8	Settings	Change password, notification settings
9	User Guide	Help documentation
---
8. Database Schema (Core Entities)
8.1 Tables
Table	Key Fields
`users`	id, name, email, password, role (super_admin/teacher/student), status, profile_image
`students`	id, user_id, admission_no, class_id, section, dob, gender, parent_name, parent_contact, address
`teachers`	id, user_id, employee_id, designation, qualification, joining_date, bio
`classes`	id, name, section, class_teacher_id, capacity
`subjects`	id, name, code, class_id
`class_subjects`	id, class_id, subject_id, teacher_id
`attendances`	id, student_id, class_id, date, status (present/absent/leave), marked_by
`assignments`	id, class_id, subject_id, teacher_id, title, description, attachment, due_date
`assignment_submissions`	id, assignment_id, student_id, file, submitted_at, status, remarks
`exams`	id, name, academic_year, start_date, end_date
`results`	id, student_id, exam_id, subject_id, marks_obtained, max_marks, grade
`timetables`	id, class_id, day, period_no, subject_id, teacher_id, start_time, end_time
`fee_structures`	id, class_id, category, amount, due_date, academic_year
`fee_payments`	id, student_id, fee_structure_id, amount_paid, payment_date, payment_mode, receipt_no, status
`admissions`	id, student_name, parent_name, contact, email, class_applied, status, applied_date
`events`	id, title, description, image, event_date, category
`achievements`	id, title, description, image, year, student_name
`gallery_albums`	id, title, description, cover_image
`gallery_media`	id, album_id, file_url, type (image/video), caption
`jobs`	id, title, description, requirements, location, type, status, posted_date
`job_applications`	id, job_id, applicant_name, email, phone, resume, cover_letter, status, applied_date
`cms_pages`	id, page_key (about/services/admission_info/etc.), title, content, image
`settings`	id, key, value
---
9. Backend Architecture Requirements (Node.js/Express/Sequelize)
9.1 Mandatory Layered Structure
For each feature, create separate files:
Model (`/models/*.model.js`) – Sequelize model definition
Controller (`/controllers/*.controller.js`) – Request/response handling
Service (`/services/*.service.js`) – Business logic, DB operations via models
Route (`/routes/*.routes.js`) – Express route definitions mapped to controllers
9.2 Additional Backend Requirements
JWT-based authentication & role-based authorization middleware
Centralized error handling middleware
Input validation (express-validator or Joi)
File upload handling (Multer) for images, resumes, documents
PDF generation (pdfkit/puppeteer) for fee receipts and result cards
Email service (Nodemailer) using provided SMTP credentials
Sequelize migrations & seeders for initial setup
Public APIs (no auth) for landing page dynamic content
Protected APIs (role-guarded) for dashboard modules
---
10. Frontend Architecture Requirements (Angular)
10.1 Mandatory Component Structure
For each feature, create a separate component with:
`feature-name.component.ts`
`feature-name.component.html`
`feature-name.component.scss`
10.2 Module Structure
`public` module — Landing page components (Home, About, Classes, Services, Faculty, Admission, Contact, Events, Achievements, Gallery, Career)
`auth` module — Login, registration (admin-created users), forgot password
`super-admin` module — All 20 admin feature components
`teacher` module — All 9 teacher feature components
`student` module — All 9 student feature components
`shared` module — Reusable components (navbar, sidebar, cards, modals, tables, charts)
`core` module — Services (auth.service, http-interceptor, guards)
10.3 Additional Frontend Requirements
Route guards per role (AuthGuard, RoleGuard)
HTTP interceptor for JWT token attachment & error handling
Charting library (ngx-charts / Chart.js) for dashboard stats
Reactive forms with validation for all CRUD operations
Responsive design (Bootstrap/Tailwind)
---
11. Non-Functional Requirements
Secure password storage (bcrypt)
Role-based access control (RBAC) at API and route level
Responsive UI across devices
Pagination, search & filter on all list views
Audit-friendly: created_at/updated_at on all tables
Environment-based configuration (.env)
---
12. Deliverables
Backend (Node.js/Express/Sequelize/MySQL) with layered architecture
Angular frontend with modular component structure
Public dynamic landing website
Three role-based dashboards
Email notification integration
Database scripts/migrations/seeders