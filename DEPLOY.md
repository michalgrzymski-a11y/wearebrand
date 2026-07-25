# SMARTCLOUT — Instrukcja wdrożenia na własnym hostingu

Ten pakiet zawiera pełny kod źródłowy strony SMARTCLOUT (React + FastAPI + MongoDB).
Poniżej krok po kroku jak uruchomić go na własnym serwerze / VPS.

---

## 📦 Zawartość paczki

```
smartclout/
├── backend/          # FastAPI + MongoDB (Python 3.10+)
│   ├── server.py
│   ├── requirements.txt
│   └── .env.example  # skopiuj do backend/.env
├── frontend/         # React + Tailwind (Node 18+)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example  # skopiuj do frontend/.env
└── DEPLOY.md         # ten plik
```

---

## 1️⃣ Wymagania serwera

- Ubuntu 22.04+ (albo dowolny inny Linux)
- Node.js 18+ (frontend build)
- Python 3.10+ (backend)
- MongoDB 6.0+
- Nginx (reverse proxy + SSL)
- Domena z rekordami DNS skierowanymi na serwer

Instalacja jednym poleceniem:
```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Python 3
sudo apt install -y python3 python3-pip python3-venv

# MongoDB 6.0
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" \
  | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod

# Nginx + Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 2️⃣ Zmienne środowiskowe

### backend/.env
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=smartclout
CORS_ORIGINS=https://twoja-domena.pl
# Opcjonalnie — chat AI oparty o Emergent LLM Key
EMERGENT_LLM_KEY=sk-emergent-XXXXXXXX
```

### frontend/.env
```env
REACT_APP_BACKEND_URL=https://twoja-domena.pl
```

> Uwaga: frontend zawsze woła `${REACT_APP_BACKEND_URL}/api/...`. Nginx (poniżej)
> proxuje `/api/` na backend, więc `REACT_APP_BACKEND_URL` = główna domena strony.

---

## 3️⃣ Uruchomienie backendu (FastAPI)

```bash
cd smartclout/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # a potem edytuj wartości
```

Test lokalny:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

Produkcyjnie — jako usługa systemd (plik `/etc/systemd/system/smartclout-api.service`):
```ini
[Unit]
Description=SMARTCLOUT FastAPI
After=network.target mongod.service

[Service]
User=www-data
WorkingDirectory=/opt/smartclout/backend
Environment=PATH=/opt/smartclout/backend/venv/bin
ExecStart=/opt/smartclout/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now smartclout-api
sudo systemctl status smartclout-api
```

---

## 4️⃣ Build i publikacja frontendu

```bash
cd smartclout/frontend
cp .env.example .env    # ustaw REACT_APP_BACKEND_URL
yarn install            # albo: npm install
yarn build              # tworzy katalog build/
```

Skopiuj `build/` do serwera Nginx:
```bash
sudo mkdir -p /var/www/smartclout
sudo cp -r build/* /var/www/smartclout/
```

---

## 5️⃣ Nginx — reverse proxy + SSL

Plik `/etc/nginx/sites-available/smartclout`:
```nginx
server {
    listen 80;
    server_name twoja-domena.pl www.twoja-domena.pl;

    # Frontend — statyczne pliki React
    root /var/www/smartclout;
    index index.html;

    # SPA fallback — routing po stronie React (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # Kompresja tekstów
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_min_length 1024;
}
```

Aktywacja + SSL:
```bash
sudo ln -s /etc/nginx/sites-available/smartclout /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d twoja-domena.pl -d www.twoja-domena.pl
```

Certbot automatycznie doda `listen 443 ssl;` i przekierowanie 80→443.

---

## 6️⃣ Weryfikacja

- `curl https://twoja-domena.pl/api/` → `{"message":"..."}`
- `curl -X POST https://twoja-domena.pl/api/contact -H "Content-Type: application/json" -d '{"name":"Test","company":"x","email":"a@b.pl","message":"hi","source":"form"}'` → `{"ok":true,...}`
- Otwórz `https://twoja-domena.pl` w przeglądarce — cała strona powinna działać.
- Sprawdź MongoDB: `mongo smartclout --eval "db.contacts.find().pretty()"`

---

## 7️⃣ Aktualizacje w przyszłości

```bash
cd /opt/smartclout
git pull
cd backend && source venv/bin/activate && pip install -r requirements.txt
sudo systemctl restart smartclout-api
cd ../frontend && yarn install && yarn build
sudo cp -r build/* /var/www/smartclout/
sudo systemctl reload nginx
```

---

## 8️⃣ Opcjonalne rozszerzenia

- **Wysyłka e-mail z formularza** — jeszcze nie wdrożone. Wymaga wyboru providera
  (Resend / SendGrid / SMTP) i dodania klucza do `backend/.env`. Endpoint już
  zapisuje leady do MongoDB — trzeba tylko dorzucić wywołanie API providera
  w `POST /api/contact`.
- **Domena własna z rekordami DNS** — ustaw `A twoja-domena.pl → IP.SERWERA`.
- **Backup MongoDB** — `mongodump --db smartclout --out /var/backups/smartclout-$(date +%F)`
  jako cron.
- **Monitoring** — polecam Uptime Kuma lub Grafana + Prometheus dla NOC-owego
  wglądu w SLA (99.99% z sekcji Ciągłość działania).

---

## 🆘 Kontakt

Jeśli utkniesz — porównaj strukturę katalogów z tym repo, sprawdź logi:
```bash
sudo journalctl -u smartclout-api -n 200
sudo tail -n 200 /var/log/nginx/error.log
```

Powodzenia! 🚀
