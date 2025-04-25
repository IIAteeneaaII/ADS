// Usar require en lugar de import
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define la carpeta donde están las plantillas EJS

// Servir archivos estáticos
app.use(express.static("public"));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', { title: 'Iniciar Sesión Fin It' }); // Pasa variables a la plantilla EJS
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
