# backend/app/database.py
import psycopg2
from psycopg2 import sql

# Configuración de la conexión a PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        dbname="registro",      # Nombre de la base de datos
        user="postgres",          # Usuario de PostgreSQL
        password="Ares:1997", # Contraseña de PostgreSQL
        host="localhost",         # Host de la base de datos
        port="5432"               # Puerto de PostgreSQL (por defecto es 5432)
    )
    return conn

# Función para registrar un usuario en PostgreSQL
def registrar_usuario(nombre, correo, usuario, contraseña):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            sql.SQL("""
                INSERT INTO usuarios (nombre_completo, correo_electronico, usuario, contraseña)
                VALUES (%s, %s, %s, %s)
            """),
            (nombre, correo, usuario, contraseña)
        )
        conn.commit()
    except psycopg2.Error as e:
        print("Error al registrar usuario:", e)
        conn.rollback()
    finally:
        cur.close()
        conn.close()

# Función para iniciar sesión en PostgreSQL
def iniciar_sesion(usuario, contraseña):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            sql.SQL("""
                SELECT * FROM usuarios WHERE usuario = %s AND contraseña = %s
            """),
            (usuario, contraseña)
        )
        user = cur.fetchone()
        return user
    except psycopg2.Error as e:
        print("Error al iniciar sesión:", e)
        return None
    finally:
        cur.close()
        conn.close()