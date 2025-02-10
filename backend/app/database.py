import psycopg2
from psycopg2 import sql
import bcrypt

# Configuración de la conexión a PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        dbname="registro",      # Nombre de la base de datos
        user="postgres",        # Usuario de PostgreSQL
        password="Ares:1997",  # Contraseña de PostgreSQL
        host="localhost",       # Host de la base de datos
        port="5432"             # Puerto de PostgreSQL (por defecto es 5432)
    )
    return conn

# Función para hashear una contraseña
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Función para verificar una contraseña
def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# Función para registrar un usuario
def registrar_usuario(nombre, correo, usuario, password):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        hashed_password = hash_password(password)
        cur.execute(
            sql.SQL("""
                INSERT INTO usuarios (nombre_completo, correo_electronico, usuario, password)
                VALUES (%s, %s, %s, %s)
            """),
            (nombre, correo, usuario, hashed_password)
        )
        conn.commit()
    except psycopg2.IntegrityError as e:
        raise Exception("El usuario o correo electrónico ya existe")
    except psycopg2.Error as e:
        raise Exception("Error en el servidor: " + str(e))
    finally:
        cur.close()
        conn.close()

# Función para iniciar sesión
def iniciar_sesion(usuario, password):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            sql.SQL("""
                SELECT id, nombre_completo, password FROM usuarios WHERE usuario = %s
            """),
            (usuario,)
        )
        user = cur.fetchone()
        if user and check_password(password, user[2]):  # user[2] es la contraseña hasheada
            return user
        else:
            return None
    except psycopg2.Error as e:
        raise Exception("Error en el servidor: " + str(e))
    finally:
        cur.close()
        conn.close()