const express = require('express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoute');
const { authMiddleware } = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    const { error } = req.query;
    res.render('index', { error });
});
app.get('/Registro', (req, res) => {
    const { error } = req.query;
    res.render('registro', { error });
});
app.get('/OlvidarContrasena', (req, res) => {
    res.render('olvidarContrasena');
});

app.get('/Preferencias', (req, res) => {
    res.render('preferencias');
});

app.get('/Inicio', authMiddleware, (req, res) => {
    res.render('inicio');
});

app.get('/EstadoDeAnimo', authMiddleware, (req, res) => {
    res.render('estadodeAnimo');
});
app.get('/GuiadeUsuario', authMiddleware, (req, res) => {
    res.render('guiadeUsuario');
});

app.get('/TerminosyCondiciones', (req, res) => {
    res.render('terminosyCondiciones');
});

app.get('/Notificaciones', authMiddleware, (req, res) => {
    res.render('notificaciones');
});

app.get('/GestionarHabitos', authMiddleware, (req, res) => {
    res.render('gestionarHabitos');
});

app.get('/MovimientoCorporal', authMiddleware, (req, res) => {
    res.render('movimientoCorporal');
});

app.get('/Mental', authMiddleware, (req, res) => {
    res.render('mental');
});

app.get('/Bienestar', authMiddleware, (req, res) => {
    res.render('bienestar');
});

app.get('/Estiramientos', authMiddleware, (req, res) => {
    res.render('estiramientos');
});


app.get('/Estadisticas',authMiddleware, (req, res) => {
    res.render('estadisticas');
});

app.get('/Estadisticas2', authMiddleware,(req, res) => {
    res.render('estadisticas2');
});

app.use('/api/auth', authRoutes);
app.use('/api/habit', authMiddleware, habitRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
