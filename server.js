const express = require('express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoute');
const principalScrRoutes = require('./routes/principalScrRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/Registro', (req, res) => {
    res.render('registro');
});
app.get('/OlvidarContrasena', (req, res) => {
    res.render('olvidarContrasena');
});

app.get('/Preferencias', (req, res) => {
    res.render('preferencias');
});

app.get('/Inicio', (req, res) => {
    res.render('inicio');
});


app.get('/EstadoDeAnimo', (req, res) => {
    res.render('estadodeAnimo');
});
app.get('/GuiadeUsuario', (req, res) => {
    res.render('guiadeUsuario');
});

app.get('/TerminosyCondiciones', (req, res) => {
    res.render('terminosyCondiciones');
});

app.get('/Notificaciones', (req, res) => {
    res.render('notificaciones');
});

app.get('/GestionarHabitos', (req, res) => {
    res.render('gestionarHabitos');
});

app.get('/MovimientoCorporal', (req, res) => {
    res.render('movimientoCorporal');
});

app.get('/Mental', (req, res) => {
    res.render('mental');
});

app.get('/Bienestar', (req, res) => {
    res.render('bienestar');
});

app.get('/Estiramientos', (req, res) => {
    res.render('estiramientos');
});


app.get('/Estadisticas', (req, res) => {
    res.render('estadisticas');
});

app.get('/Estadisticas2', (req, res) => {
    res.render('estadisticas2');
});


app.use('/api/auth', authRoutes);
app.use('/api/habit', authMiddleware, habitRoutes);
app.use('/api/inicio', authMiddleware, principalScrRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
