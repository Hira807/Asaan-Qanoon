# ⚖️ Asaan Qanoon — AI-Powered Pakistani Legal Assistant

Asaan Qanoon is an AI legal assistant that answers questions about Pakistani **Family Law**, **Criminal Law**, and **Property Law** in English, Urdu, and Roman Urdu. Built as a university project using a RAG (Retrieval-Augmented Generation) pipeline.

---

## 📁 Project Structure

```
Asaan-Qanoon/
├── frontend/          # HTML, CSS, JS — the web interface
│   ├── Home.html
│   ├── Home.js
│   ├── Style.css
│   ├── logo.png
│   ├── about.html / about.css / about.js
│   ├── ask-question.html / ask-question.css / ask-question.js
│   └── browse-laws.html / browse-laws.css / browse-laws.js
│
├── backend/            # Flask API + RAG pipeline
│   ├── app.py
│   ├── requirements.txt
│   └── law_data.json    # Pre-computed embeddings (1706 entries)
│
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **Vector Database:** ChromaDB
- **Embeddings:** Google Gemini (`gemini-embedding-001`)
- **Text Generation:** Groq (`llama-3.3-70b-versatile`)
- **Hosting:** Render (backend), Live Server / GitHub Pages (frontend)

---

## 🚀 Setup Instructions (New Laptop)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/Asaan-Qanoon.git
cd Asaan-Qanoon
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create environment variables (or set them in your terminal):

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

Run the backend locally:

```bash
python app.py
```

The API will run on `http://localhost:5000` (or the port specified by `PORT` env variable).

**Or deploy to Render:**
1. Push this repo to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `python -u app.py`
5. Add environment variables `GEMINI_API_KEY` and `GROQ_API_KEY`

### 3. Frontend Setup

The frontend is plain HTML/CSS/JS — no build step needed.

**Option A — VS Code Live Server (recommended for local testing):**
1. Open the `frontend/` folder in VS Code
2. Install the "Live Server" extension
3. Right-click `Home.html` → "Open with Live Server"

**Option B — GitHub Pages (to host publicly):**
1. Push this repo to GitHub
2. Go to repo **Settings → Pages**
3. Set source branch to `main`, folder to `/frontend`
4. Your site will be live at `https://your-username.github.io/Asaan-Qanoon/`

### 4. Connect Frontend to Backend

In `frontend/Home.js` and `frontend/ask-question.js`, update the `API_URL` constant to point to your backend:

```javascript
const API_URL = "https://your-backend-url.onrender.com/ask";
```

---

## 🔑 API Keys Needed

| Service | Used For | Get a Key |
|---|---|---|
| Google Gemini | Generating embeddings | [aistudio.google.com](https://aistudio.google.com) |
| Groq | Generating answers (translation + response) | [console.groq.com](https://console.groq.com) |

---

## 📊 Dataset

The `law_data.json` file contains **1706 pre-embedded entries** combining:
- Q&A pairs from a Hugging Face Pakistani law dataset
- Manually curated Family/Criminal/Property law facts
- Chunked excerpts from official Pakistani law texts (Pakistan Penal Code, Muslim Family Laws Ordinance, Registration Act, etc.) sourced from the [AyeshaJadoon/Pakistan_Laws_Dataset](https://huggingface.co/datasets/AyeshaJadoon/Pakistan_Laws_Dataset) on Hugging Face

Each entry includes a `question`, `response`, and a 256-dimension `embedding` vector.

---

## ⚠️ Disclaimer

This is an academic prototype. It does **not** constitute legal advice. For real legal matters, consult a licensed lawyer registered with the Pakistan Bar Council.

---

## 📄 License

Academic project — for educational use only.
