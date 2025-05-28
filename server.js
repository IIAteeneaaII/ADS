const express = require('express');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habitRoute');
const principalScrRoutes = require('./routes/principalScrRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');
const { loadAllJobs } = require('./utils/jobManager');
require('./utils/UploadHabitsPerDay');
const { renderCalendar } = require('./controllers/authController');
const { interesesPreferencias, interesesActividades } = require('./utils/interesesData');

const { getRecentNotifications, countUnreadNotifications, markAllAsRead, getNotificationsTime, updateNotificationHours } = require('./repositories/habitRepositoryPrisma');

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

app.get('/Bienvenida', authMiddleware, (req, res) => {
    res.render('bienvenida');
});

app.get('/OlvidarContrasena', (req, res) => {
    res.render('olvidarContrasena');
});

app.get('/ingresarcodigo', (req, res) => {
    res.render('ingresarcodigo');
});

app.get('/cambiocontrasena', (req, res) => {
    res.render('cambiocontrasena');
});

app.get('/calendario_emociones', authMiddleware, renderCalendar);

app.get('/racha', authMiddleware, (req, res) => {
    res.render('racha');
});

app.get('/Preferencias', authMiddleware, (req, res) => {
    res.render('preferencias', {
        tituloPagina: 'Selecciona tus intereses',
        tituloPrincipal: 'Preferencias',
        mensajeIntro: 'Para personalizar tus recomendaciones de manera óptima, ¡cuéntanos un poco sobre tus gustos e intereses!',
        rutaOmitir: '/inicio',
        intereses: interesesPreferencias
    });
});

app.get('/Actividades', authMiddleware, (req, res) => {
    res.render('preferencias', {
        tituloPagina: 'Tus preferencias favoritas',
        tituloPrincipal: '¿Qué preferencias disfrutas?',
        mensajeIntro: 'Selecciona las preferencias que más te identifican.',
        rutaOmitir: null,
        intereses: interesesActividades
    });
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
    user=req.user;
    res.render('estadodeAnimo',{user});
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

app.get('/Estadisticas', authMiddleware, (req, res) => {
    res.render('estadisticas');
});

app.get('/Estadisticas2', authMiddleware, (req, res) => {
    res.render('estadisticas2');
});

app.get('/EliminarCuenta', authMiddleware, (req, res) => {
    res.render('eliminarCuenta');
});

app.get('/EliminarCuenta1', authMiddleware, (req, res) => {
    res.render('eliminarCuenta1');
});

app.get('/EliminarCuenta2', authMiddleware, (req, res) => {
    res.render('eliminarCuenta2');
});

app.get('/Privacidad', authMiddleware, (req, res) => {
    res.render('privacidad');
});

app.get('/FaltaDeTiempo', authMiddleware, (req, res) => {
    res.render('faltadetiempo');
});

app.get('/UsoFinit', authMiddleware, (req, res) => {
    res.render('usofinit');
});

app.get('/personalizado', authMiddleware, (req, res) => {
    res.render('habitoPersonalizado',{ habit: null });
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

app.get('/quienesSomos', authMiddleware, (req, res) => {
    res.render('quienesSomos');  //
});

app.get('/GestionarHabitos', authMiddleware, (req, res) => {
    res.render('gestionarHabitos');
});

// CREAR hábito personalizado
app.get('/personalizado', authMiddleware, (req, res) => {
    res.render('habitoPersonalizado', { habit: null }); // crear
});

// EDITAR hábito personalizado
app.get('/habitoPersonalizado/:id/editar', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('habitoPersonalizado', { habit }); // editar
    } catch (error) {
        console.error('Error al cargar hábito personalizado para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

// VER hábito personalizado (pantalla de gráficas y calendario)
app.get('/perso/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('perso', { habit }); // ver gráficas
    } catch (error) {
        console.error('Error al cargar el hábito personalizado:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

// Crear nuevo hábito correr
app.get('/GestionarCorrer', authMiddleware, (req, res) => {
  res.render('gestionarcorrer', { habit: null });
});

//Editar hábito
app.get('/GestionarCorrer/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);

    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');

        res.render('gestionarcorrer', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


app.get('/Correr/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);

    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');

        res.render('correr', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

// Crear nuevo hábito bicicleta
app.get('/gestionarbicicleta', authMiddleware, (req, res) => {
  res.render('gestionarbicicleta', { habit: null });
});

//Editar hábito
app.get('/gestionarbicicleta/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);

    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');

        res.render('gestionarbicicleta', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/bicicleta/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);

    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');

        res.render('bicicleta', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});
// Crear nuevo hábito CuidadoPiel
app.get('/gestionarcuidadopiel', authMiddleware, (req, res) => {
  res.render('gestionarcuidadopiel', { habit: null });
});

// Editar hábito
app.get('/gestionarcuidadopiel/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarcuidadopiel', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/CuidadoPiel/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('CuidadoPiel', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito DesintoxicacionDigital
app.get('/gestionarDesintoxicacionDigital', authMiddleware, (req, res) => {
  res.render('gestionarDesintoxicacionDigital', { habit: null });
});

// Editar hábito
app.get('/gestionarDesintoxicacionDigital/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarDesintoxicacionDigital', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/desintoxicacionDigital/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('desintoxicacionDigital', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito Estiramientos
app.get('/gestionarestiramientos', authMiddleware, (req, res) => {
  res.render('gestionarestiramientos', { habit: null });
});

// Editar hábito
app.get('/gestionarestiramientos/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarestiramientos', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/Estiramientos/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('Estiramientos', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito Hidratacion
app.get('/gestionarhidratacion', authMiddleware, (req, res) => {
  res.render('gestionarhidratacion', { habit: null });
});

// Editar hábito
app.get('/gestionarhidratacion/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarhidratacion', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/Hidratacion/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('Hidratacion', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito horasdormir
app.get('/gestionarhorasdormir', authMiddleware, (req, res) => {
  res.render('gestionarhorasdormir', { habit: null });
});

// Editar hábito
app.get('/gestionarhorasdormir/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarhorasdormir', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/horasdormir/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('horasdormir', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito Lectura
app.get('/gestionarlectura', authMiddleware, (req, res) => {
  res.render('gestionarlectura', { habit: null });
});

// Editar hábito
app.get('/gestionarlectura/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarlectura', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/Lectura/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('Lectura', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito Meditacion
app.get('/gestionarmeditacion', authMiddleware, (req, res) => {
  res.render('gestionarmeditacion', { habit: null });
});

// Editar hábito
app.get('/gestionarmeditacion/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarmeditacion', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/Meditacion/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('Meditacion', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito MusicaRelajante
app.get('/gestionarmusicarelajante', authMiddleware, (req, res) => {
  res.render('gestionarmusicarelajante', { habit: null });
});

// Editar hábito
app.get('/gestionarmusicarelajante/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarmusicarelajante', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/MusicaRelajante/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('MusicaRelajante', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito ordenarespacio
app.get('/gestionarordenarespacio', authMiddleware, (req, res) => {
  res.render('gestionarordenarespacio', { habit: null });
});

// Editar hábito
app.get('/gestionarordenarespacio/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarordenarespacio', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/ordenarespacio/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('ordenarespacio', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito SaltarCuerda
app.get('/gestionarsaltarcuerda', authMiddleware, (req, res) => {
  res.render('gestionarsaltarcuerda', { habit: null });
});

// Editar hábito
app.get('/gestionarsaltarcuerda/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('gestionarsaltarcuerda', { habit });
    } catch (error) {
        console.error('Error al cargar hábito para editar:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/SaltarCuerda/:id', authMiddleware, async (req, res) => {
    const habitId = parseInt(req.params.id);
    const userId = req.user.id;

    try {
        const habit = await prisma.userHabit.findFirst({
            where: {
                id: habitId,
                userId: userId
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');
        res.render('SaltarCuerda', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

app.get('/ConfigurarNotificaciones', authMiddleware, async (req, res) => {
    const { afternoonHour, morningHour, nightHour } = await getNotificationsTime(req.user.id);
    res.render('configNotis', {
        afternoonHour,
        morningHour,
        nightHour
    })
});

app.post('/ConfigurarNotificaciones', authMiddleware, async (req, res) => {
    const { morningHour, afternoonHour, nightHour } = req.body;

    await updateNotificationHours(req.user.id, morningHour, afternoonHour, nightHour);

    res.redirect('/ConfigurarNotificaciones');
});

app.use('/api/auth', authRoutes);
app.use('/api/habit', authMiddleware, habitRoutes);
app.use('/api/inicio', authMiddleware, principalScrRoutes);

//pruebas, no estara en la app
app.use('/api/cargarHabitos', cargarHabitosRoutes);
//


const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, async () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
    await loadAllJobs();
});
