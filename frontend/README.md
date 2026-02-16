📁 FRONTEND FOLDER & FILE ARCHITECTURE

Stack: Next.js (App Router) + TypeScript + Tailwind + Django REST API

🧱 ROOT STRUCTURE
src/
├── app/
├── components/
├── features/
├── lib/
├── hooks/
├── services/
├── store/
├── types/
├── styles/
├── constants/
└── middleware.ts

🧭 app/ — ROUTING & PAGE LAYOUTS (App Router)
app/
├── layout.tsx
├── globals.css
├── page.tsx                // Landing page
│
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── onboarding/
│   ├── language/
│   │   └── page.tsx
│   └── placement-test/
│       └── page.tsx
│
├── dashboard/
│   ├── page.tsx
│   ├── vocabulary/
│   │   └── page.tsx
│   ├── flashcards/
│   │   └── page.tsx
│   ├── assessments/
│   │   └── page.tsx
│   ├── progress/
│   │   └── page.tsx
│   ├── dialog-missions/
│   │   └── page.tsx
│   ├── ai-chat/
│   │   └── page.tsx
│   ├── mistakes/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx


Rule:
app/ = routing only.
No business logic. No API calls. No “just this one helper bro”.

🧩 components/ — SHARED UI (DUMB COMPONENTS)
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Tooltip.tsx
│   ├── ProgressBar.tsx
│   └── Skeleton.tsx
│
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
│
└── feedback/
    ├── ErrorMessage.tsx
    └── SuccessToast.tsx


Rule:
Components here:

No API calls

No React Query

No business rules

If it thinks → it doesn’t belong here.

🧠 features/ — CORE APP LOGIC (THIS IS THE GOLD)
features/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── auth.schema.ts
│   ├── auth.hooks.ts
│   └── auth.types.ts
│
├── onboarding/
│   ├── LanguageSelector.tsx
│   ├── PlacementTest.tsx
│   └── onboarding.hooks.ts
│
├── vocabulary/
│   ├── VocabularyList.tsx
│   ├── VocabularyCard.tsx
│   ├── Flashcard.tsx
│   └── vocabulary.hooks.ts
│
├── assessments/
│   ├── Quiz.tsx
│   ├── Question.tsx
│   ├── Feedback.tsx
│   └── assessments.hooks.ts
│
├── progress/
│   ├── ProgressOverview.tsx
│   ├── AchievementJournal.tsx
│   └── progress.hooks.ts
│
├── ai/
│   ├── ChatWindow.tsx
│   ├── MessageBubble.tsx
│   └── ai.hooks.ts
│
└── mistakes/
    ├── MistakeList.tsx
    └── mistakes.hooks.ts


Rule:
One feature = one folder
Everything related lives together. No scavenger hunts.

🌐 services/ — DJANGO REST API LAYER

This is where DRF meets React Query.

services/
├── api.ts                // Axios instance
│
├── auth.service.ts
├── onboarding.service.ts
├── vocabulary.service.ts
├── assessments.service.ts
├── progress.service.ts
├── ai.service.ts
└── mistakes.service.ts

api.ts (example)
- Base URL
- JWT attach interceptor
- Refresh token handling
- 401 auto-logout


Rule:
All HTTP logic lives here.
Components NEVER call Axios directly.

🧪 hooks/ — GENERIC REUSABLE HOOKS
hooks/
├── useAuth.ts
├── useDebounce.ts
├── useAudioPlayer.ts
└── useLocalStorage.ts


No feature-specific logic here.

🧾 types/ — SHARED TYPES (DRF CONTRACTS)
types/
├── auth.ts
├── user.ts
├── vocabulary.ts
├── assessment.ts
├── progress.ts
└── api.ts


These should mirror Django REST serializers.
If backend changes → this folder changes → compile screams. Good.

🧠 store/ — GLOBAL STATE (LIGHT ONLY)
store/
├── auth.store.ts
└── onboarding.store.ts


Use Zustand or similar.
If React Query can handle it → don’t put it here.

🎨 styles/
styles/
├── tailwind.css
└── theme.css

📌 constants/
constants/
├── routes.ts
├── languages.ts
└── queryKeys.ts


Stop hardcoding strings like a menace.

🛡️ middleware.ts
- Protect authenticated routes
- Redirect unauth users
- Token presence check (NOT validation)