# Node.js API

Esta es una API básica en Node.js con los siguientes componentes:
- **Express**: Para la creación del servidor y manejo de rutas.
- **PostgreSQL**: Base de datos relacional para almacenamiento de usuarios.
- **Redis**: Usado como sistema de cache y para la integración futura con **Bull.js** (para colas de trabajo).
- **Swagger**: Documentación interactiva de la API.

## Requisitos

Para ejecutar esta aplicación en tu máquina local necesitas tener instalados los siguientes programas:

- **Node.js** v16+ [Node.js](https://nodejs.org/en/)
- **Docker** para contenedores (para usar PostgreSQL y Redis) [Docker](https://www.docker.com/)

##  Instalación
2. Instala las dependencias de Node.js:

    ```bash
    npm install
    ```

3. Levanta los servicios con Docker:

    Asegúrate de tener Docker y Docker Compose instalados en tu máquina. Luego ejecuta:

    ```bash
    docker-compose up -d
    ```

    Esto levantará los contenedores de PostgreSQL y Redis.

4. Configura el archivo `.env` (copia el archivo `.env.example`):

    ```bash
    cp .env.example .env
    ```

    Edita el archivo `.env` con tus credenciales de base de datos y otras configuraciones necesarias.

##  Ejecución de la API

Para iniciar el servidor en modo desarrollo:

  ```bash
  Genera el prisma client: npx prisma generate
  Aplica la migracion: npx prisma migrate dev --name init
  npm run dev
  ```

## 📜 Endpoints

### `POST /api/auth/register`

**Descripción**: Registra un nuevo usuario en la base de datos.

#### Body:

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "userName": "userName1234"

}
```

#### Respuestas:

- `201`: Usuario registrado con éxito.

  ```json
  {
    "message": "User registered successfully"
  }
  ```

- `400`: Error en los datos de entrada.

  ```json
  {
    "message": "Invalid input"
  }
  ```

- `500`: Error del servidor.

  ```json
  {
    "message": "Internal server error"
  }
  ```

---

### `POST /api/auth/login`

**Descripción**: Inicia sesión de un usuario y devuelve un token JWT.

#### Body:

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

#### Respuestas:

- `200`: Login exitoso con JWT.

  ```json
  {
    "token": "jwt_token_here"
  }
  ```

- `400`: Credenciales incorrectas.

  ```json
  {
    "message": "Invalid credentials"
  }
  ```

- `500`: Error del servidor.

  ```json
  {
    "message": "Internal server error"
  }
  ```


### POST /habits/custom

Crea un nuevo hábito personalizado para el usuario autenticado.

#### Autenticación

Este endpoint requiere autenticación mediante un token JWT.

** Header: Authorization: Bearer <token> **

### 📥 Request Body

```json
{
  "name": "Leer 30 minutos",
  "description": "Leer un libro cada noche antes de dormir",
  "frequency": {
    "type": "daily"
  },
  "reminderTime": {
    "hour": 21,
    "minute": 0
  },
  "startDate": "2025-04-25T00:00:00.000Z"
}
```

Lo que puede aceptar frequency:

```json

{
  "type": "daily"
}

{
  "type": "weekly",
  "days": ["monday", "wednesday", "friday"]
}


```

## Contributors

