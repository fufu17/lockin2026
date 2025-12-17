# LockIn2026

A production-ready web app for focused work sessions with a public commitment wall. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![LockIn2026](https://img.shields.io/badge/LockIn-2026-6366f1?style=for-the-badge)

## Features

- **One-Tap Lock-In Hero**: Start a focus session in 3 quick steps
  - Choose your mode (Study, Build, Content, Gym, Deep Work)
  - Set duration (25, 50, 90 min or custom)
  - Define your goal
  - Full-screen focus mode with countdown timer

- **Public Commitment Wall**: Live feed of what people are locking in on
  - Real-time updates via Supabase Realtime
  - Beautiful card-based UI with avatars
  - Status badges (In Progress, Completed, Expired)

- **Session Tracking**: Save sessions to your account
  - Focus rating (1-5 stars)
  - Session history
  - Streak tracking

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone the repository

```bash
git clone <repository-url>
cd lockin2026
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Settings > API** and copy your project URL and anon key

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Supabase Setup

### Database Schema

The app uses three main tables:

- **profiles**: User profiles (extends Supabase Auth)
- **sessions**: Focus session records
- **commitments**: Public commitment wall entries

Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables, indexes, and RLS policies.

### Authentication

The app uses Supabase Auth with magic link (email) authentication. To enable:

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Configure email templates if desired

### Realtime

Realtime is automatically enabled for the `commitments` table in the schema. This powers the live updates on the commitment wall.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

### 3. Update Supabase Auth URL

After deployment, update your Supabase Auth settings:

1. Go to **Authentication > URL Configuration**
2. Add your Vercel URL to **Site URL**
3. Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── commitments/     # Commitments API
│   │   └── sessions/        # Sessions API
│   ├── auth/
│   │   └── callback/        # Auth callback handler
│   ├── focus/               # Focus session page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── AuthModal.tsx        # Authentication modal
│   ├── CommitmentCard.tsx   # Wall card component
│   ├── CommitmentForm.tsx   # Wall submission form
│   ├── CommitmentWall.tsx   # Main wall section
│   ├── FocusSession.tsx     # Focus mode screen
│   ├── Footer.tsx           # Footer
│   ├── Hero.tsx             # Hero section
│   ├── HowItWorks.tsx       # How it works section
│   ├── LockInModal.tsx      # Session setup modal
│   ├── Navbar.tsx           # Navigation
│   ├── SessionComplete.tsx  # Session completion screen
│   └── TimerPreview.tsx     # Hero timer preview
├── hooks/
│   ├── useSupabase.ts       # Supabase client hooks
│   └── useTimer.ts          # Timer logic hook
├── lib/
│   ├── supabase/            # Supabase client setup
│   └── utils.ts             # Utility functions
└── types/
    └── database.ts          # TypeScript types
```

## Design Highlights

- **Dark Theme**: Focused, energetic design with indigo accent color
- **Glassmorphism**: Subtle glass card effects with backdrop blur
- **Micro-interactions**: Smooth hover states, transitions, and animations
- **Mobile-first**: Responsive design that works on all devices
- **Custom Timer Ring**: Animated progress ring with glow effects

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your own projects!

---

Built with focus. Ship with purpose.
