# =========================
# 🐍 BASE IMAGE (LIGHTWEIGHT)
# =========================
FROM python:3.11-slim

# =========================
# ⚙️ ENV SETTINGS
# =========================
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# =========================
# 📁 WORKDIR
# =========================
WORKDIR /app

# =========================
# 📦 INSTALL SYSTEM DEPENDENCIES
# =========================
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# =========================
# 📥 INSTALL PYTHON DEPENDENCIES (CACHED)
# =========================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =========================
# 📂 COPY PROJECT
# =========================
COPY . .

# =========================
# 🚀 RUN WITH GUNICORN (PRODUCTION)
# =========================
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000", "--workers", "3"]