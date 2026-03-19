**Démarer le serveur**

1. Si vous utilise Docker

```bash
docker-compose up --build
docker-compose up
```

2. Sinon

```bash
pip install -r requirement.txt
cd backend
uvicorn main:app --reload
```
