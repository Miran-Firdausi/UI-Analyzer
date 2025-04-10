# UI Analyzer – AI-Powered UI Feedback Tool

UI Analyzer is an AI-driven tool that evaluates user interface screenshots and gives detailed feedback on **accessibility**, **usability**, **visual design**, and **consistency**. Upload a UI image, and the system will return improvement suggestions, strengths, and category-wise scores.

---

## 🚀 Features

- Upload UI screenshots for analysis  
- Get structured JSON with:
  - ✅ Strengths
  - ❌ Improvements
  - 📊 Metrics (accessibility, usability, consistency, visual design)
- Gemini Vision + LLM integration for intelligent feedback  
- Modern UI built with React  
- Cross-origin support (CORS)

---

## 🛠️ Installation

### 🔧 Backend (Django + DRF)

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/ui-analyzer.git
cd ui-analyzer/backend
```

2. **Create a Virtual Environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**

```bash
pip install -r requirements.txt
```

4. **Setup Google Generative AI**

Make sure you have a valid **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).

Set it as an environment variable:

```.env
GOOGLE_API_KEY="your-key-here"
```

5. **Run the Server**

```bash
python manage.py runserver
```

API will run at: `http://127.0.0.1:8000/api/analyze-ui/`

---

### 💻 Frontend (React)

1. **Navigate to frontend folder**

```bash
cd ../frontend
```

2. **Install Dependencies**

```bash
npm install
```

3. **Start Development Server**

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173/`

---

## 🔁 API Usage

**Endpoint:** `POST /api/analyze-ui/`  
**Payload Type:** `multipart/form-data`  
**Body:**
```bash
image: <file>
```

**Response:**
```json
{
  "overallScore": 72,
  "improvements": [
    "Text contrast is low.",
    "Dropdown not labeled clearly."
  ],
  "strengths": [
    "Good use of whitespace.",
    "Consistent button styling."
  ],
  "metrics": {
    "accessibility": 65,
    "consistency": 75,
    "usability": 80,
    "visualDesign": 68
  }
}
```

---

## 📦 Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Django, Django REST Framework
- **AI Engine:** Google Gemini API (Text + Image)
- **Others:** CORS, File Upload Handling

---

## 📸 Screenshots


---

## 🙌 Contributing

Pull requests are welcome. Feel free to open issues for feature suggestions or bug reports!
