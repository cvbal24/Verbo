# 📚 Verbo Backend Folder and File Architecture

This contains the backend codebase for **Verbo**, a language learning and conversational AI platform.  
The backend is built with **Django + Django REST Framework**, organized into modular apps for clarity, scalability, and maintainability.

## 🏗️ Backend Structure

backend/
├── ai_chat/
├── ai_content/
├── assessment/
├── audio/
├── audio_manager/
├── authentication/
├── backend/
├── core_config
├── dialog/
├── flashcards/
├── grammar/
├── idioms/
├── mistakes/
├── placement/
├── preferences/
├── progress/
├── venv/
├── vocabulary/
├── voice/
├── db.sqlite3
├── manage.py
├── README.md
└── requirements.txt

---

## ⚙️ Design Principles

- **Modularity** → Each feature lives in its own app (`ai_chat`, `grammar`, `progress`, etc.).
- **Separation of Concerns** → Authentication, content, chat, and analytics are isolated.
- **Scalability** → Easy to add new apps without disrupting existing ones.
- **Maintainability** → Consistent naming conventions and file responsibilities.

---

## 🚀 Key Apps

| App             | Purpose                                                                 |
|-----------------|-------------------------------------------------------------------------|
| **ai_chat**     | Handles chat requests, integrates with Google Gemini AI.                |
| **ai_content**  | Generates adaptive learning materials using AI.                         |
| **assessment**  | Provides quizzes/tests to evaluate learner progress.                    |
| **audio**       | Speech recognition and text-to-speech features.                         |
| **audio_manager**  | Manages audio processing and flow.                                   |
| **authentication** | User accounts, login, registration, and permissions.                 |
| **core_config**    | Stores global settings and configs.                                  |
| **dialog**      | Manages tutoring prompts and structured dialogue flows.                 |
| **flashcards**  | Manages flashcard learning system.                                      |
| **grammar**     | Grammar explanations, parsing, and correction logic.                    |
| **idioms**      | Handles idioms and expressions.                                         |
| **mistakes**    | Tracks and analyzes user errors.                                        |
| **placement**   | Determines user skill level.                                            |
| **preferences** | Stores user preferences/settings                                        |
| **progress**    | Tracks learner progress, achievements, and analytics.                   |
| **vocabulary**  | Word banks, flashcards, and vocabulary exercises.                       |
| **voice**       | Voice-based interaction and conversational practice.                    |

---
## 📌 Notes

- This backend is designed for **educational platforms** with multilingual support.  
- AI integration uses **Google Gemini models** for tutoring and content generation.  
- Database defaults to **SQLite** for local development; can be swapped for PostgreSQL in production.  

---
