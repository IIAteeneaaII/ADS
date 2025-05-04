const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); 

// Cargar variables de entorno
dotenv.config();

const app = express();

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts); // Middleware para layouts
app.set('layout', 'layouts/layout'); // ⬅️ Indica qué layout usar (carpeta 'views/layouts')

// Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.render('pages/index', { title: 'Iniciar Sesión Fin It' }); // Ruta y título
});

app.get('/registro', (req, res) => {
    res.render('pages/registro', { title: 'Registro Fin It' });
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});