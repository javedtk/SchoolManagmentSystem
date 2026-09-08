Development Plan
School Management System (SMS)
---
1. Tech Stack
Backend: Node.js, Express.js, Sequelize ORM, MySQL
Frontend: AngularJS (Angular), Bootstrap/Tailwind, ngx-charts/Chart.js
Auth: JWT + bcrypt
Email: Nodemailer (Gmail SMTP)
File Storage: Local/Multer (uploads folder, served statically)
---
2. Project Structure
2.1 Backend Structure
```
sms-backend/
├── config/
│   ├── db.config.js
│   ├── email.config.js
│   └── env.js
├── models/
│   ├── user.model.js
│   ├── student.model.js
│   ├── teacher.model.js
│   ├── class.model.js
│   ├── subject.model.js
│   ├── classSubject.model.js
│   ├── attendance.model.js
│   ├── assignment.model.js
│   ├── assignmentSubmission.model.js
│   ├── exam.model.js
│   ├── result.model.js
│   ├── timetable.model.js
│   ├── feeStructure.model.js
│   ├── feePayment.model.js
│   ├── admission.model.js
│   ├── event.model.js
│   ├── achievement.model.js
│   ├── galleryAlbum.model.js
│   ├── galleryMedia.model.js
│   ├── job.model.js
│   ├── jobApplication.model.js
│   ├── cmsPage.model.js
│   ├── setting.model.js
│   └── index.js (associations)
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── student.service.js
│   ├── teacher.service.js
│   ├── class.service.js
│   ├── subject.service.js
│   ├── attendance.service.js
│   ├── assignment.service.js
│   ├── result.service.js
│   ├── timetable.service.js
│   ├── fee.service.js
│   ├── admission.service.js
│   ├── event.service.js
│   ├── achievement.service.js
│   ├── gallery.service.js
│   ├── job.service.js
│   ├── jobApplication.service.js
│   ├── cms.service.js
│   ├── settings.service.js
│   ├── email.service.js
│   ├── pdf.service.js
│   └── dashboard.service.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── student.controller.js
│   ├── teacher.controller.js
│   ├── class.controller.js
│   ├── subject.controller.js
│   ├── attendance.controller.js
│   ├── assignment.controller.js
│   ├── result.controller.js
│   ├── timetable.controller.js
│   ├── fee.controller.js
│   ├── admission.controller.js
│   ├── event.controller.js
│   ├── achievement.controller.js
│   ├── gallery.controller.js
│   ├── job.controller.js
│   ├── jobApplication.controller.js
│   ├── cms.controller.js
│   ├── settings.controller.js
│   └── dashboard.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── student.routes.js
│   ├── teacher.routes.js
│   ├── class.routes.js
│   ├── subject.routes.js
│   ├── attendance.routes.js
│   ├── assignment.routes.js
│   ├── result.routes.js
│   ├── timetable.routes.js
│   ├── fee.routes.js
│   ├── admission.routes.js
│   ├── event.routes.js
│   ├── achievement.routes.js
│   ├── gallery.routes.js
│   ├── job.routes.js
│   ├── jobApplication.routes.js
│   ├── cms.routes.js
│   ├── settings.routes.js
│   ├── dashboard.routes.js
│   ├── public.routes.js (aggregates dynamic public APIs)
│   └── index.routes.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── upload.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
├── migrations/
├── seeders/
├── uploads/
├── .env
├── app.js
└── server.js
```
2.2 Frontend Structure (Angular)
```
sms-frontend/
├── src/app/
│   ├── core/
│   │   ├── services/ (auth.service.ts, api.service.ts, token.service.ts)
│   │   ├── guards/ (auth.guard.ts, role.guard.ts)
│   │   └── interceptors/ (auth.interceptor.ts, error.interceptor.ts)
│   ├── shared/
│   │   ├── components/ (navbar, footer, sidebar, stat-card, data-table, modal, chart)
│   │   └── pipes/, directives/
│   ├── public/
│   │   ├── home/ (home.component.ts/.html/.scss)
│   │   ├── about-us/
│   │   ├── classes/
│   │   ├── services/
│   │   ├── faculty/
│   │   ├── admission/
│   │   ├── contact-us/
│   │   ├── events/
│   │   ├── achievements/
│   │   ├── gallery/
│   │   ├── career/
│   │   └── public.module.ts
│   ├── auth/
│   │   ├── login/
│   │   └── auth.module.ts
│   ├── super-admin/
│   │   ├── dashboard/
│   │   ├── admission-corner/
│   │   ├── fee-receipt/
│   │   ├── manage-teachers/
│   │   ├── manage-subjects/
│   │   ├── manage-classes/
│   │   ├── manage-students/
│   │   ├── manage-events/
│   │   ├── manage-gallery/
│   │   ├── manage-fee/
│   │   ├── manage-achievements/
│   │   ├── manage-attendance/
│   │   ├── manage-results/
│   │   ├── manage-timetable/
│   │   ├── manage-jobs/
│   │   ├── manage-job-applications/
│   │   ├── settings/
│   │   ├── profile/
│   │   ├── user-guide/
│   │   └── super-admin.module.ts
│   ├── teacher/
│   │   ├── dashboard/
│   │   ├── assigned-class/
│   │   ├── attendance/
│   │   ├── assignments/
│   │   ├── results/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── settings/
│   │   ├── profile/
│   │   ├── user-guide/
│   │   └── teacher.module.ts
│   ├── student/
│   │   ├── dashboard/
│   │   ├── assignments/
│   │   ├── attendance/
│   │   ├── events/
│   │   ├── fee-receipt/
│   │   ├── pay-fee/
│   │   ├── result/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── user-guide/
│   │   └── student.module.ts
│   ├── app-routing.module.ts
│   └── app.module.ts
└── environments/
```
Each feature component folder contains:
`*.component.ts`
`*.component.html`
`*.component.scss`
---
3. Development Phases
Phase 0: Project Setup (Day 1-2)
Initialize Node.js project, install Express, Sequelize, mysql2, jwt, bcrypt, multer, nodemailer, dotenv
Setup `.env` with DB and email config
Initialize Angular project, install Bootstrap/Tailwind, ngx-charts
Setup Sequelize connection (`config/db.config.js`) using DB_NAME=schldbdev001, DB_HOST=localhost, DB_PORT=3306, DB_USERNAME=root, DB_PASSWORD=root
Setup Nodemailer transporter using EMAIL_USER=junednite@gmail.com and EMAIL_APP_PASSWORD
Phase 1: Database & Auth (Day 3-5)
Create all Sequelize models with associations (per schema in PRD section 8)
Run migrations to create tables in `schldbdev001`
Seed default Super Admin user
Build `auth` module: login, JWT issuance, role middleware
Angular: Login component, AuthGuard, RoleGuard, HTTP interceptor
Phase 2: Core Master Data Modules (Day 6-10)
Manage Classes (model/service/controller/route + Angular component)
Manage Subjects
Manage Teachers (with credential creation on user table)
Manage Students (with credential creation on user table)
Class-Subject-Teacher assignment
Phase 3: Public Landing Page (Dynamic) (Day 11-15)
CMS pages model/service for static-ish content (About, Services)
Public APIs (no-auth) for: Classes, Faculty, Admission info, Events, Achievements, Gallery, Career/Jobs
Build Angular `public` module pages: Home, About Us, Classes, Services, Faculty, Admission, Contact Us, Events, Achievements, Gallery, Career
Contact Us form → triggers email via Nodemailer
Admission Page → Admission enquiry form → stored in `admissions` table
Phase 4: Admin Content Management Modules (Day 16-20)
Manage Events (CRUD + image upload)
Manage Achievements (CRUD + image upload)
Manage Gallery (albums + media CRUD, image/video upload)
Manage Jobs (CRUD)
Manage Job Applications (view, resume download, status update)
Admission Corner (view enquiries, convert to student)
Phase 5: Academic Operations (Day 21-27)
Manage Time Table (per class/section, period-wise CRUD)
Manage Student Attendance (mark/view, daily & report)
Manage Assignments (Teacher: create; Student: view/submit)
Manage Results (Exam setup, marks entry by Teacher, Admin override/publish)
Result card PDF generation
Phase 6: Fee Management (Day 28-31)
Manage Fee (fee structure per class/category)
Manage Fee Receipt (generate, PDF, email to student)
Student: View Fee Receipt, Pay Due Fee (payment gateway integration placeholder)
Phase 7: Dashboards & Stats (Day 32-35)
Super Admin Dashboard: stats cards (students, teachers, classes, fees, admissions), charts (enrollment trend, fee collection, attendance %)
Teacher Dashboard: assigned class summary, pending assignments, today's timetable
Student Dashboard: attendance %, pending fees, upcoming events, latest results
Phase 8: Settings, Profile, User Guide (Day 36-38)
Settings: school profile, SMTP config, academic year (Super Admin)
Profile: view/edit for all 3 roles, password change
User Guide: static help content per role
Phase 9: Testing & Deployment (Day 39-42)
Unit/integration testing of APIs
E2E testing of Angular flows
Build production bundles, environment configs
Deployment setup (PM2 for Node, Nginx for Angular build)
---
4. API Route Prefix Convention
```
/api/auth/...
/api/public/...        (no auth - landing page)
/api/admin/...          (super admin only)
/api/teacher/...        (teacher only)
/api/student/...        (student only)
/api/common/...         (shared across roles - profile, settings)
```
---
5. Environment Variables (.env)
```
PORT=5000
DB_NAME=schldbdev001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DIALECT=mysql

JWT_SECRET=<generate-secure-secret>
JWT_EXPIRY=1d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=junednite@gmail.com
EMAIL_APP_PASSWORD=dhbl vllw bvjl sqnf
EMAIL_SECURE=false

UPLOAD_DIR=uploads
```
---
6. Key Architectural Rules (Strict)
Node.js: Each feature must have its own `model`, `service`, `controller`, and `route` file — no combining multiple features into one file.
Angular: Each feature must be its own component with separate `.ts`, `.html`, and `.scss` files — no inline templates/styles.
All dynamic landing page sections must read from DB tables managed via corresponding Admin modules.
All protected routes must pass through `auth.middleware.js` and `role.middleware.js`.
Use Sequelize migrations (not `sync({force:true})`) for schema changes in production.