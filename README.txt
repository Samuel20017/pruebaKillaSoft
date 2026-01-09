Prueba KillaSoft

Requisitos previos:
- Python 3.11 o 3.12
- Node.js 18 o 20
- npm 9+

Ejecución para desarrolladores:

Backend (FastAPI):
1) cd back
2) python -m venv venv
3) source venv/bin/activate   (Windows: venv\Scripts\activate)
4) pip install -r requirements.txt
5) uvicorn main:app --reload
URL: http://localhost:8000  |  Docs: http://localhost:8000/docs

Frontend (Angular):
1) cd front
2) npm install
3) npm start
URL: http://localhost:4200

Ejecución con Docker:
1) docker compose build
2) docker compose up -d
Frontend: http://localhost:8080
Backend:  http://localhost:8000

Detener:
- docker compose down

Puertos:
- Backend (FastAPI): 8000
- Frontend (Angular dev): 4200
- Frontend (Docker/Nginx): 8080
