const express = require('express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoute');
const principalScrRoutes = require('./routes/principalScrRoutes');
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
app.get('/reset-password', (req, res) => {
    const token = req.query.token;
    res.render('ingresarcodigo', { token });
});

app.get('/Preferencias', authMiddleware, (req, res) => {
    res.render('preferencias');
});

app.get('/Inicio', authMiddleware, (req, res) => {
    const { userName } = req.user;
    res.render('inicio',{userName});
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
app.get('/GestionarMisHabitos', authMiddleware, (req, res) => {
    res.render('gestionarMisHabitos');
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

app.get('/GestionarEstiramientos', authMiddleware, (req, res) => {
    res.render('gestionarestiramientos');
});

app.get('/HorasDeDormir', authMiddleware, (req, res) => {
    res.render('horasdeDormir');
});

app.get('/OrdenarEspacio', authMiddleware, (req, res) => {
    res.render('ordenarEspacio');
});

app.get('/Alimentacion', authMiddleware, (req, res) => {
    res.render('alimentacion');
});

app.get('/Estadisticas',authMiddleware, (req, res) => {
    res.render('estadisticas');
});

app.get('/Estadisticas2', authMiddleware,(req, res) => {
    res.render('estadisticas2');
});

app.get('/EliminarCuenta', authMiddleware,(req, res) => {
    res.render('eliminarCuenta');
});

app.get('/EliminarCuenta1', authMiddleware,(req, res) => {
    res.render('eliminarCuenta1');
});

app.get('/EliminarCuenta2', authMiddleware,(req, res) => {
    res.render('eliminarCuenta2');
});

app.get('/Privacidad', authMiddleware,(req, res) => {
    res.render('privacidad');
});

app.get('/FaltaDeTiempo', authMiddleware,(req, res) => {
    res.render('faltadetiempo');
});

app.get('/UsoFinit', authMiddleware,(req, res) => {
    res.render('usofinit');
});

app.get('/personalizado', authMiddleware, (req, res) => {
  res.render('habitoPersonalizado');
});

app.get('/actualizarPerfil', authMiddleware, (req, res) => {
    res.render('actualizarPerfil', { user: req.user });
  });
  

app.use('/api/auth', authRoutes);
app.use('/api/habit', authMiddleware, habitRoutes);
app.use('/api/inicio', authMiddleware, principalScrRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
