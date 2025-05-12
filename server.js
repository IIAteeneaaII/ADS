const express = require('express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoute');
const principalScrRoutes = require('./routes/principalScrRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');
const { loadAllJobs } = require('./utils/jobManager');
require('./utils/UploadHabitsPerDay');

const { getRecentNotifications, countUnreadNotifications, markAllAsRead } = require('./repositories/habitRepositoryPrisma');


//pruebas, no estara en la app
const cargarHabitosRoutes = require('./routes/cargarhabitos');
//
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

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

app.get('/ingresarcodigo', (req, res) => {
    res.render('ingresarcodigo');
});

app.get('/calendario_emociones', (req, res) => {
    res.render('calendario_emociones');
});

app.get('/reset-password', (req, res) => {
    const token = req.query.token;
    res.render('ingresarcodigo', { token });
});

app.get('/Preferencias', authMiddleware, (req, res) => {
    res.render('preferencias');
});

app.get('/Inicio', authMiddleware, async (req, res) => {
const unreadNotifications = await countUnreadNotifications(req.user.id) || 0;

const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
    userName: true,
    profilePic: true
    }
});

res.render('inicio', {
    userName: user.userName,
    profilePic: user.profilePic,
    unreadNotifications
});
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

app.get('/Notificaciones', authMiddleware, async (req, res) => {
    const notifications = await getRecentNotifications(req.user.id);
    
    markAllAsRead(req.user.id);

    res.render('notificaciones', {
        notifications
    });
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

app.get('/Hidratacion', authMiddleware, (req, res) => {
    res.render('hidratacion');
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


app.get('/actualizarPerfil', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.redirect('/login');
    }

    res.render('actualizarPerfil', { user });
  } catch (err) {
    console.error('Error al cargar el perfil:', err);
    res.status(500).send('Error al cargar el perfil');
  }
});

  
app.get('/quienesSomos', (req, res) => {
    res.render('quienesSomos');  //
  });

app.get('/GestionarCorrer', authMiddleware,(req, res) => {
res.render('gestionarcorrer');  //
});

app.get('/GestionarBici', authMiddleware,(req, res) => {
res.render('gestionarbicicleta');  //
});

app.get('/Correr', authMiddleware,(req, res) => {
    res.render('correr');  //
  });

app.get('/Bicicleta', authMiddleware,(req, res) => {
    res.render('bicicleta');  //
  });

app.get('/GestionarOrdenarEspacio', authMiddleware,(req, res) => {
    res.render('gestionarOrdenarEspacio');  //
  });

app.get('/GestionarHorasDormir', authMiddleware, (req, res) => {
    res.render('gestionarhorasdormir');
});

app.get('/SaltarCuerda', authMiddleware, (req, res) => {
    res.render('saltarCuerda');
});

app.get('/DesintoxicacionDigital', authMiddleware, (req, res) => {
    res.render('desintoxicacionDigital');
});

app.get('/CuidadoPiel', authMiddleware, (req, res) => {
    res.render('cuidadoPiel');
});

app.get('/Lectura', authMiddleware, (req, res) => {
    res.render('lectura');
});

app.get('/Meditacion', authMiddleware, (req, res) => {
    res.render('meditacion');
});

app.get('/MusicaRelajante', authMiddleware, (req, res) => {
    res.render('musicaRelajante');
});

app.get('/GestionarSaltarCuerda', authMiddleware, (req, res) => {
    res.render('gestionarSaltarCuerda');
});

app.get('/GestionarDesintoxicacionDigital', authMiddleware, (req, res) => {
    res.render('gestionarDesintoxicacionDigital');
});

app.get('/GestionarCuidadoPiel', authMiddleware, (req, res) => {
    res.render('gestionarCuidadoPiel');
});

app.get('/GestionarHidratacion', authMiddleware, (req, res) => {
    res.render('gestionarHidratacion');
});

app.get('/GestionarLectura', authMiddleware, (req, res) => {
    res.render('gestionarLectura');
});

app.get('/GestionarMeditacion', authMiddleware, (req, res) => {
    res.render('gestionarMeditacion');
});

app.get('/GestionarMusicaRelajante', authMiddleware, (req, res) => {
    res.render('gestionarMusicaRelajante');
});

app.use('/api/auth', authRoutes);
app.use('/api/habit', authMiddleware, habitRoutes);
app.use('/api/inicio', authMiddleware, principalScrRoutes);

//pruebas, no estara en la app
app.use('/api/cargarHabitos', cargarHabitosRoutes);
//


const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)

    await loadAllJobs()
});
