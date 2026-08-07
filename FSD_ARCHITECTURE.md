# AdminRH-France - Feature-Sliced Design (FSD) Structure

This document outlines the architecture for **AdminRH-France**, a learning platform for HR professionals moving to France, following the **Feature-Sliced Design (FSD)** methodology.

---

## 🏗️ Layers & Slices

### 1. App (`src/app`)
*System-wide configuration and entry points.*
- **Providers**: `TanStack Router`, `React Query`, `Sonner (Toaster)`.
- **Global Styles**: Tailwind CSS v4 (`src/styles.css`).
- **Initialization**: App bootstrap logic (`src/start.ts`, `src/router.tsx`).

### 2. Processes (`src/processes`)
*Complex workflows that span multiple pages.*
- **Auth Flow**: User registration, Google OAuth, and initial redirection.

### 3. Pages (`src/pages`)
*Application screens built by composing widgets.*
- **LandingPage**: The entry gate (HD Seal display).
- **AuthPage**: Login/Signup forms.
- **DashboardPage**: Main overview with KPIs and planning.
- **LearningPage**: Knowledge base and legal library.
- **QuizPage**: Quiz selection and active test sessions.
- **ProgressionPage**: Stats and WhatsApp history.
- **AdminPage**: Expert content editor and WhatsApp management.

### 4. Widgets (`src/widgets`)
*Self-contained UI blocks that combine multiple features.*
- **Sidebar**: Primary navigation with branding.
- **GlobalHeader**: Search bar, notifications, and user profile.
- **StatGrid**: Dashboard KPI cards.
- **WeeklyChart**: Performance and engagement visualization.
- **LessonEditor**: Specialized form for legal dossiers.

### 5. Features (`src/features`)
*User-facing actions and business logic.*
- **AuthWithGoogle**: Social login integration.
- **SearchLegalDatabase**: Logic for filtering lessons and quiz themes.
- **TakeQuiz**: Session management, shuffling, and feedback logic.
- **ManageWhatsApp**: Testing connections and template editing.
- **AddNotes/Objectives**: Personalization tools for HR learners.

### 6. Entities (`src/entities`)
*Business models and data handling.*
- **User**: Profile data and `has_role` checks.
- **Lesson/Dossier**: Legal content structure (Casus, Reference, Article).
- **Quiz**: Selection criteria and result submission.
- **WhatsAppLog**: History of delivered notifications.

### 7. Shared (`src/shared`)
*Reusable tools and UI components.*
- **UI Kit**: Shadcn-based components (Button, Card, Input, etc.).
- **API**: Supabase client, WhatsApp server functions.
- **Lib**: Data generators, regex validators, date formatting.
- **Assets**: HD Branding (Zenith/AdminRH-France seals).

---

## 🛠️ Tech Stack
- **Framework**: TanStack Start v1 (React 19).
- **Routing**: TanStack Router.
- **State/Data**: TanStack Query + Supabase.
- **Styling**: Tailwind CSS v4 (Bento Box / Navy & Gold identity).
- **Communication**: CallMeBot API (WhatsApp).

---

## 📂 Mapping to Current Codebase

| FSD Layer | Current Path |
| :--- | :--- |
| **App** | `src/start.ts`, `src/router.tsx`, `src/styles.css` |
| **Pages** | `src/routes/` (e.g., `learning.tsx`, `dashboard.tsx`) |
| **Shared/UI** | `src/components/ui/` |
| **Shared/API** | `src/integrations/supabase/`, `src/lib/*.functions.ts` |
| **Shared/Lib** | `src/lib/utils.ts`, `src/lib/all_questions.json` |
| **Shared/Assets** | `src/assets/` |
