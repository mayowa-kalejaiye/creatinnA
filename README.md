# CreatINN Academy - Learning Management System

A premium learning management system for CreatINN Academy, built with Next.js 14+, TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Project Overview

**One-Line Positioning:**  
CreatINN Academy is a selective creative and business institution where skills are taught, but access, endorsement, and alumni status are earned.

**Core Belief:**  
Creative skill without business intelligence leads to poverty.

## 🎯 What's Built

### ✅ Complete Marketing Website
- Homepage with physical academy emphasis (Lagos, Nigeria)
- Programs page (2-Week Intensive ₦100k, 1-on-1 Mastery ₦600k, Online ₦30k)
- Alumni Track information (Layer 2 education)
- Application system (no application fee)
- About, FAQ, Contact, Privacy, Terms, Thinkinn pages
- Premium dark theme with glass morphism design

### ✅ Student Portal (LMS)
- **Dashboard** - View enrolled courses, progress tracking, certificates
- **Course Browser** - Browse all published courses with enrollment status
- **Course Player** - Full video player with:
  - Lesson navigation sidebar
  - Progress tracking (mark lessons complete)
  - Video playback (YouTube, Vimeo support via react-player)
  - Lesson content/notes display
  - Real-time progress calculation

### ✅ Admin Portal
- **Admin Dashboard** - Overview stats, recent enrollments, pending applications
- **Course Creation** - Create new courses with full details
- **Course Editor** - Complete course management:
  - Edit course details (title, description, price, level, category, thumbnail)
  - Add/manage modules with descriptions
  - Add/manage lessons with video URLs, duration, and content
  - Publish/unpublish courses
  - View enrollment and module statistics

### ✅ Database Schema (Prisma + SQLite)
- **Users** - Student/Admin roles with authentication
- **Courses** - Course catalog with pricing and metadata
- **Modules** - Course sections with ordered lessons
- **Lessons** - Video lessons with content and progress tracking
- **Enrollments** - User enrollments with progress percentages
- **Progress** - Individual lesson completion tracking
- **Certificates** - Completion certificates
- **Applications** - Student application records
- **Payments** - Payment transaction records

### ✅ Authentication System
- NextAuth.js with JWT strategy
- Email/password authentication with bcryptjs hashing
- Role-based access control (STUDENT/ADMIN)
- Protected routes and API endpoints
- Session management with automatic redirects

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Video Player:** react-player
- **Fonts:** Inter (body), Plus Jakarta Sans (display)
- **State Management:** Zustand
- **Date Handling:** date-fns
- **Notifications:** react-hot-toast

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
npm install
```

### Database Setup

```bash
# Initialize and migrate the database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Creating an Admin User

1. Sign up normally through the website
2. Open Prisma Studio:

```bash
npx prisma studio
```

3. Navigate to the `User` table
4. Find your user and change `role` from `STUDENT` to `ADMIN`
5. Refresh the page and you'll have admin access

## 📁 Project Structure

```
app/
├── (auth)/
│   ├── login/              # Login page
│   └── signup/             # Signup page
├── admin/                  # Admin dashboard
│   └── courses/
│       ├── new/            # Create new course
│       └── [slug]/         # Edit course with modules/lessons
├── course/
│   └── [slug]/             # Course player with video lessons
├── courses/                # Browse all published courses
├── dashboard/              # Student dashboard
├── api/
│   ├── auth/               # NextAuth API routes
│   ├── courses/            # Course CRUD operations
│   │   └── [courseId]/
│   │       ├── route.ts    # Update/delete course
│   │       ├── enroll/     # Enroll in course
│   │       └── modules/    # Create modules
│   ├── modules/
│   │   └── [moduleId]/
│   │       └── lessons/    # Create lessons
│   └── progress/           # Track lesson completion
└── (marketing)/
    ├── page.tsx            # Homepage
    ├── programs/           # Programs overview
    ├── alumni/             # Alumni track
    ├── apply/              # Application form
    ├── about/              # About CreatINN
    ├── faq/                # FAQs
    ├── contact/            # Contact page
    ├── thinkinn/           # Thinkinn content
    ├── privacy/            # Privacy policy
    └── terms/              # Terms of service
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
creatinnA/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── programs/           # Layer 1: Skill Programs
│   ├── alumni/             # Layer 2: Alumni Track
│   ├── apply/              # Application page
│   ├── thinkinn/           # The Thinkinn content
│   └── about/              # About page
├── components/
│   ├── Header.tsx          # Navigation header
│   └── Footer.tsx          # Site footer
└── .github/
    └── copilot-instructions.md  # Project guidelines
```

## Brand Guidelines

### Tone & Messaging
- Elite institution positioning (not online course platform)
- Emphasize selectivity and discipline
- No "make money fast" language
- No open-admission vibe
- Access is earned, not automatic

### Two-Layer Education Model

**Layer 1: Skill Programs**
- 2-Week Video Editing Intensive (₦100,000)
- 1-on-1 Mastery Track (₦600,000)
- Online Video Editing Course (₦30,000)

**Layer 2: Alumni Track**
- 5-month advanced journey
- Monetization & business focus
- Alumni status is earned
- Invitation-only

## Design System

### Colors
- **Primary:** Purple gradient
- **Accent:** Gold (#d4af37)
- **Background:** Black
- **Text:** White with opacity variants

### Typography
- **Headings:** Plus Jakarta Sans (Display font)
- **Body:** Inter (Sans-serif)

### Key UI Patterns
- Glass morphism effects
- Premium shadows
- Gradient text
- Smooth animations with Framer Motion

## 🎯 Key Features

### For Students
✅ Browse and enroll in courses  
✅ Track progress across all courses  
✅ Mark lessons as complete  
✅ Watch video lessons with react-player  
✅ Access course materials anytime  
✅ View completion percentage  
✅ Earn certificates on completion  

### For Admins
✅ Create and manage unlimited courses  
✅ Add modules and lessons with video URLs  
✅ Edit course details (pricing, description, level, category)  
✅ Publish/unpublish courses  
✅ View enrollment statistics  
✅ Monitor student progress  
✅ Manage applications  
✅ Track revenue and payments  

## 📋 Next Steps (Future Development)

### Payment Integration (High Priority)
- [ ] Integrate Paystack for Nigerian payments
- [ ] Integrate Flutterwave as backup
- [ ] Automatic enrollment on successful payment
- [ ] Payment webhook handlers
- [ ] Payment history for students
- [ ] Revenue analytics for admin

### Content Management
- [ ] Video file upload (not just URLs)
- [ ] Lesson resources/attachments (PDFs, files)
- [ ] Quiz/assessment system
- [ ] Discussion forums per course
- [ ] Course preview videos
- [ ] Bulk lesson import

### Certificate System
- [ ] Auto-generate certificates on 100% completion
- [ ] Downloadable PDF certificates with branding
- [ ] Certificate verification system (public URL)
- [ ] Certificate templates

### Advanced Features
- [ ] Email notifications (enrollment, completion)
- [ ] Application review workflow for admin
- [ ] Student feedback/course reviews
- [ ] Analytics dashboard (completion rates, popular courses)
- [ ] Course bundles and discounts
- [ ] Referral system

### Mobile App
- [ ] React Native mobile app
- [ ] Offline video downloads
- [ ] Push notifications

## 🔒 Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT session management via NextAuth
- Role-based access control (STUDENT/ADMIN)
- Protected API routes with session checks
- SQL injection prevention (Prisma ORM)
- CSRF protection built into Next.js
- Secure password requirements

## 📱 Responsive Design

Fully responsive across all devices:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎓 Brand Guidelines

The platform maintains CreatINN Academy's premium positioning:
- Selective, not mass-market
- Skills + business intelligence focus
- Two-layer education model (Skill Programs vs Alumni Track)
- Physical academy emphasis (Lagos, Nigeria)
- No guarantees or hype language
- Elite, disciplined tone

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database management
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx prisma generate        # Generate Prisma client
npx prisma migrate reset   # Reset database (⚠️ deletes all data)
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### Database connection issues
Check your `.env` file has correct `DATABASE_URL`

### Authentication not working
Ensure `NEXTAUTH_SECRET` is set in `.env`

### Video player not loading
Ensure lesson videoUrl is a valid YouTube/Vimeo URL

## License

Private project for CreatINN Academy.

---

**Built with discipline. Designed for excellence.**  
CreatINN Academy © 2026
