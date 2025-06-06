
# 🏋️‍♂️ Fitmate – Personalized Workout Partner Matcher

Fitmate is a full-stack application that helps users find compatible fitness partners based on their goals, location, preferences, and availability. It combines a React frontend, a Node.js backend, and a Python-based matching algorithm powered by machine learning.

---

## 🗂️ Project Structure

```
Fitmate/
├── fitness-matcher-frontend/        # React frontend
├── fitness-matcher-backend/
│   ├── node-backend/                # Node.js API
│   └── python-matching-algorithem/  # Python ML service
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- Python (v3.9+)
- MongoDB
- Redis

---

### ⚛️ Frontend (React)

```bash
cd fitness-matcher-frontend
npm install
npm run dev
```

Runs the frontend at [http://localhost:5173](http://localhost:5173)

---

### 🌐 Backend (Node.js API)

```bash
cd fitness-matcher-backend/node-backend
npm install
npm run dev
```

Runs the API server at [http://localhost:3000](http://localhost:3000)

> Make sure `.env` includes variables like `MONGO_URI`, `JWT_SECRET`, etc.

---

### 🐍 Python Matching Algorithm (Flask)

```bash
cd fitness-matcher-backend/python-matching-algorithem
pip install -r requirements.txt
python app.py
```

This service handles matchmaking logic using machine learning.

---

## 📦 Third-Party Libraries (רשימת ספריות צד ג')

### ⚛️ Frontend – React

| Library | Purpose |
|--------|---------|
| `react`, `react-dom`, `react-router-dom` | Core UI and routing |
| `axios`, `jwt-decode` | API communication and token handling |
| `react-select`, `react-tinder-card`, `react-spinners` | UI widgets |
| `tailwindcss`, `tw-animate-css`, `tailwind-merge` | Styling and animations |
| `@radix-ui/*`, `lucide-react` | UI primitives and icons |
| `@vitejs/plugin-react`, `vite` | Dev server and build tool |
| `eslint`, `@eslint/js`, TypeScript types | Development tooling |

### 🌐 Backend – Node.js

| Library | Purpose |
|--------|---------|
| `express`, `mongoose`, `cors` | API and DB |
| `jsonwebtoken`, `bcryptjs` | Auth and hashing |
| `redis`, `dotenv`, `body-parser`, `axios` | Caching, config, requests |

### 🐍 Python Matching Service

| Library | Purpose |
|--------|---------|
| `Flask`, `pymongo`, `redis` | API and persistence |
| `scikit-learn`, `xgboost`, `tensorflow`, `torch`, `transformers` | Matching and ML |
| `nltk`, `spacy`, `textblob` | NLP |
| `pandas`, `matplotlib`, `seaborn` | Data analysis |
| `sweetviz`, `pandas-profiling` | EDA reporting |
| `python-dotenv`, `requests` | Utility libraries |

---

## 📸 Screenshots

> _(Leave space here to insert interface screenshots later)_

---

## 🧠 Matching Algorithm

The Python microservice uses Mahalanobis distance with additional rule-based filters to compute similarity between users, based on:
- Fitness goals
- Workout preferences
- Location
- Availability

Results are cached in Redis and refreshed every 10 minutes.

---

## 🔒 Environment Variables

Each component requires its own `.env` file. Examples:

### Backend (`node-backend/.env`)
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### Python Matching (`python-matching-algorithem/.env`)
```
REDIS_HOST=localhost
REDIS_PORT=6379
MONGO_URI=your_mongodb_uri
```

---

## 📌 To Do

- [ ] User feedback/rating system after meetings
- [ ] Admin dashboard
- [ ] Push notifications for match updates

---

## 📄 License

MIT License – free to use and modify.

---

## 👨‍💻 Contributors

- **Dev A** – Algorithm, Backend
- **Dev B** – Frontend, Admin UI
