import bcrypt
from database import get_db_connection  # Asegúrate de importar la función correcta

def registrar_usuario(nombre, correo, usuario, contraseña):
    conexion = get_db_connection()  # Usa la función correcta
    if conexion:
        cursor = conexion.cursor()
        
        # Encriptar la contraseña
        hashed_password = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        try:
            cursor.execute(
                "INSERT INTO usuarios (nombre_completo, correo_electronico, usuario, password) VALUES (%s, %s, %s, %s)",
                (nombre, correo, usuario, hashed_password)
            )
            conexion.commit()
            return True
        except Exception as e:
            print(f"Error al registrar usuario: {e}")
            return False
        finally:
            cursor.close()
            conexion.close()
    return False

def verificar_usuario(usuario, contraseña):
    conexion = get_db_connection()
    if conexion:
        cursor = conexion.cursor()
        try:
            cursor.execute("SELECT password FROM usuarios WHERE usuario = %s", (usuario,))
            resultado = cursor.fetchone()

            if resultado:
                stored_password = resultado[0]
                if bcrypt.checkpw(contraseña.encode('utf-8'), stored_password.encode('utf-8')):
                    return True
        except Exception as e:
            print(f"Error al verificar usuario: {e}")
        finally:
            cursor.close()
            conexion.close()
    
    return False
