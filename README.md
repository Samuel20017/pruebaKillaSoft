# Prueba KillaSoft

## Requisitos Previos

- Python 3.11 o 3.12
- Node.js 18 o 20
- npm 9+

## Ejecución para Desarrolladores

### Backend (FastAPI)

```bash
cd back
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- URL API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Frontend (Angular)

```bash
cd front
npm install
npm start
```

- URL Frontend: http://localhost:4200

## Ejecución con Docker

### Construir y levantar

```bash
docker compose build
docker compose up -d
```

- Frontend: http://localhost:8080
- Backend (API): http://localhost:8000

### Detener

```bash
docker compose down
```

## Puertos

- Backend (FastAPI): 8000
- Frontend (Angular dev): 4200
- Frontend (Docker/Nginx): 8080
