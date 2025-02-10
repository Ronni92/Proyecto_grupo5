import psycopg2

# Configuración de la conexión a PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        dbname="registro",      # Nombre de la base de datos
        user="postgres",        # Usuario de PostgreSQL
        password="Ares:1997",   # Contraseña de PostgreSQL
        host="localhost",       # Host de la base de datos
        port="5432"             # Puerto de PostgreSQL (por defecto es 5432)
    )
