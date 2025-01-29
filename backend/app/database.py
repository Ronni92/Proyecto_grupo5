from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔴 CAMBIA 'password' POR LA CONTRASEÑA QUE CONFIGURASTE EN DOCKER-COMPOSE
DATABASE_URL = "postgresql://user:password@db:5432/schedule_ai"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
