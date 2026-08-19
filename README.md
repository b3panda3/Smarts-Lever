# 🧠 Smarts Lever

> **Learn Anything, In Your Language.**
> An AI-powered vernacular education platform for West Africa.

---

## 🏆 Wema Bank Hackaholics 2026 — Social Impact Track

**Smarts Lever** is built for **Wema Bank's Hackaholic 7.0** hackathon, competing in the **Third Track: Social Impact**. The platform addresses the critical gap in educational accessibility across West Africa by delivering complex academic content in the languages people actually speak — Pidgin English, Yoruba, Hausa, Igbo, Twi, Wolof, Fanti, Bambara, and many more vernacular languages that are systematically excluded from formal educational materials.

---

## 📖 Project Description

Smarts Lever is a sophisticated, AI-driven learning platform designed to democratize education across West Africa. The platform takes traditionally complex subjects — Physics, Mathematics, Chemistry, Law, Computer Science, and more — and breaks them down into understandable, retainable, and engaging lessons using the learner's own vernacular language, complete with local slang, cultural references, and real-life analogies that resonate with the learner's daily experience.

### The Problem

Across West Africa, over **400 million people** speak hundreds of indigenous languages and creoles. Yet formal education — textbooks, online courses, research papers, and even AI-generated content — is overwhelmingly delivered in English or French. This creates a two-tier system where:

- Students in rural areas struggle to comprehend concepts taught in their second or third language
- Adult learners seeking to upskill face an immediate language barrier
- Teachers in under-resourced schools lack materials they can use to reach students who think in their mother tongue
- Cultural knowledge and indigenous ways of understanding the world are erased from academic discourse

### Our Solution

Smarts Lever uses Google's Gemini AI to dynamically generate entire curricula and lesson content adapted to each learner's:

- **Primary language** (Pidgin, Yoruba, Hausa, Twi, Wolof, etc.)
- **Education level** (primary through professional)
- **Cultural context** (country, city, daily life experiences)
- **Learning style preferences** (captured through intelligent profiling)

The result is education that feels like learning from a knowledgeable friend who speaks your language, rather than reading a sterile textbook written for someone else.

---

## ✨ Key Features

### 🔐 Authentication System
- Email/password registration and login
- **Google Sign-In / Sign-Up** integration
- Secure session management via NextAuth.js

### 📝 AI-Guided Onboarding
- **5-step onboarding wizard** that builds a comprehensive learner profile:
  1. **User Type**: Individual, Teacher, School, Government/NGO, or Study Group
  2. **Profile Details**: Name/organization, age group, education level
  3. **Location**: City, state, and country (all 16 West African nations)
  4. **Language**: Primary learning language from 15+ vernacular options or custom input
  5. **Subject Selection**: Multi-subject picker with 16+ standard subjects plus custom additions
- AI automatically generates a personalized curriculum based on the profile

### 🧠 AI-Powered Curriculum Generation
- Gemini AI creates structured, modular curricula for each selected subject
- Each curriculum is broken into progressive lessons
- Content is generated in the learner's chosen vernacular with:
  - **Slang and informal language** for accessibility
   - **Real-life analogies** from West African contexts
   - **Cultural references** that make abstract concepts tangible
   - **References and citations** for academic credibility

### 📚 Interactive Learning Environment
- Beautiful markdown-rendered lesson content
- **Slang notes** section explaining informal terms used
- **Key takeaways** summary cards for quick revision
- **References & citations** for further study
- **Previous/Next navigation** through lessons
- **Progress tracking** with visual indicators

### 💬 AI Tutor Chat
- Ask questions and get instant, vernacular-aware explanations
- Context-aware: the AI tutor knows what lesson you're on
- Conversational style matching the learner's language and tone
- Full chat history saved and accessible

### 📊 Progress Tracking
- Visual progress bars for each curriculum
- Lesson completion status tracking
- Dashboard overview of all learning activities

### 🔄 Adaptive Profiling
- Occasional questions during learning to refine the user's profile
- AI adjusts teaching style and language complexity based on responses
- The more you learn, the better the platform understands you

---

## 🌍 Supported Languages

| Language | Primary Countries | Script |
|----------|-------------------|--------|
| Pidgin English | Nigeria, Ghana, Cameroon | Latin |
| Yoruba | Nigeria, Benin, Togo | Latin |
| Hausa | Nigeria, Niger, Ghana, Burkina Faso | Latin/Boko |
| Igbo | Nigeria | Latin |
| Twi | Ghana, Cote d'Ivoire | Latin |
| Fanti | Ghana | Latin |
| Wolof | Senegal, Gambia, Mauritania | Latin |
| French | Cote d'Ivoire, Senegal, Mali, Burkina Faso, Togo, Benin, Niger, Guinea | Latin |
| Bambara | Mali, Burkina Faso, Senegal, Ivory Coast | Latin/N'Ko |
| Ewe | Ghana, Togo | Latin |
| Fulfulde | Nigeria, Senegal, Guinea, Mali, Burkina Faso, Niger | Latin/Adlam |
| Ga | Ghana | Latin |
| Soninke | Mali, Senegal, Burkina Faso, Ivory Coast | Latin |
| Temne | Sierra Leone | Latin |
| Krio | Sierra Leone | Latin |

*Plus any custom language the user specifies during onboarding.*

---

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling with custom brand theme |
| **shadcn/ui** | Accessible, composable UI components |
| **Prisma ORM** | Type-safe database operations (SQLite) |
| **NextAuth.js** | Authentication with Google + credentials providers |
| **Zustand** | Lightweight client-side state management |
| **Framer Motion** | Smooth page transitions and micro-interactions |
| **Google Gemini 2.0 Flash** | AI curriculum generation, lesson content, and tutoring chat |
| **Supabase** | Cloud database and authentication backend |
| **Cloudinary** | Media storage for avatars and learning materials |
| **Resend** | Transactional email delivery |
| **React Markdown** | Beautiful lesson content rendering |

---

## 📁 Project Structure

```
smarts-lever/
├── prisma/
│   └── schema.prisma          # Database schema (User, Curriculum, Lesson, Progress, Chat)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main SPA entry (view router)
│   │   ├── globals.css         # Brand theme (emerald/amber)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts   # NextAuth handlers
│   │       │   └── register/route.ts        # User registration
│   │       ├── onboarding/
│   │       │   └── complete/route.ts        # Save profile, generate curricula
│   │       ├── curriculum/
│   │       │   ├── list/route.ts            # List user curricula
│   │       │   └── [id]/route.ts            # Curriculum detail with lessons
│   │       ├── lesson/
│   │       │   └── generate/route.ts        # Generate lesson in vernacular
│   │       ├── chat/route.ts                # AI tutor chat endpoint
│   │       └── profile-questions/route.ts   # Adaptive profiling questions
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── views/
│   │       ├── LandingView.tsx      # Hero, features, problem statement, CTA
│   │       ├── LoginView.tsx        # Email/password + Google Sign-In
│   │       ├── SignupView.tsx       # Registration form
│   │       ├── OnboardingView.tsx   # 5-step profile wizard
│   │       ├── DashboardView.tsx    # Curriculum overview, progress
│   │       ├── LessonView.tsx       # Main learning environment
│   │       └── ChatView.tsx         # AI tutor chat interface
│   ├── store/
│   │   └── useAppStore.ts      # Zustand global state
│   └── lib/
│       ├── auth-options.ts     # NextAuth configuration
│       ├── db.ts               # Prisma client
│       └── utils.ts            # Utility functions
├── .env.local                   # API keys and secrets
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- API keys for:
  - Google Cloud Console (OAuth 2.0 Client ID & Secret)
  - Google Gemini API
  - Supabase (URL + Anon Key)
  - Cloudinary (Cloud Name, API Key, Secret)
  - Resend (API Key)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/smarts-lever.git
cd smarts-lever

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Initialize the database
bun run db:push
bun run db:generate

# Start the development server
bun run dev
```

### Environment Variables

Create a `.env.local` file with the following:

```env
DATABASE_URL="file:./db.sqlite"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
RESEND_API_KEY="your-resend-key"
```

---

## 🎯 How It Works

### 1. User Signs Up or Logs In
Users can create an account with email/password or use Google Sign-In for instant access. The platform is designed for both individuals and groups (schools, teachers, government agencies, NGOs).

### 2. AI-Guided Onboarding
A conversational 5-step wizard collects:
- Who they are (individual, teacher, school, etc.)
- Their background (age, education level)
- Where they're from (city, state, country)
- **What language they learn best in** (the core differentiator)
- What subjects they want to study

### 3. AI Generates Personalized Curriculum
Using the Gemini AI, Smarts Lever creates a structured curriculum for each selected subject. The curriculum is broken into progressive modules and lessons, all designed to be taught in the user's chosen vernacular.

### 4. Learn In Your Language
Each lesson features:
- Content written in the user's vernacular with slang and cultural references
- Real-life examples from familiar West African contexts
- References and citations for academic credibility
- Key takeaways for quick revision
- Slang notes to bridge formal and informal understanding

### 5. Ask the AI Tutor
Stuck on a concept? The built-in AI tutor chat provides instant explanations in the same vernacular. It knows your current lesson, your language preference, and your learning history.

### 6. Track Your Progress
Visual dashboards show how far you've come in each subject. The platform also periodically asks profiling questions to refine its understanding of your learning style and adjust future content accordingly.

---

## 🌱 Social Impact

Smarts Lever directly addresses **UN Sustainable Development Goal 4: Quality Education** by:

1. **Removing language barriers** to education for over 400 million West Africans
2. **Preserving indigenous languages** by integrating them into formal learning contexts
3. **Democratizing access** to quality education regardless of location or economic status
4. **Empowering teachers** with culturally relevant teaching materials
5. **Bridging the rural-urban divide** in educational outcomes

### Target Impact Metrics

- **Primary users**: Students aged 15-35 across Nigeria, Ghana, Senegal, Cote d'Ivoire, and 12 other West African countries
- **Secondary users**: Teachers, schools, and educational NGOs seeking vernacular teaching resources
- **Scale potential**: 400M+ people speaking 500+ languages across West Africa
- **Expected outcome**: 60% improvement in concept retention when learning in one's mother tongue vs. a second language

---

## 🏦 Wema Bank Hackaholics 2026

**Track:** Social Impact (Track 3)
**Event:** Hackaholic 7.0
**Organizer:** Wema Bank PLC, Nigeria
**Website:** https://hackaholics.wemabank.com/

Smarts Lever aligns with Wema Bank's commitment to driving innovation for social good across Nigeria and West Africa. By leveraging AI to solve the deep-rooted problem of educational language exclusion, we demonstrate how technology can create meaningful, scalable social impact.

---

## 👥 Team

Built with passion for the Hackaholic 7.0 hackathon.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Smarts Lever: Because education should speak your language.*
