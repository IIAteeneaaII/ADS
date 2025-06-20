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
const { getHabitIcon } = require('./utils/habitIcons');

const { getRecentNotifications, countUnreadNotifications, markAllAsRead, getNotificationsTime, updateNotificationHours } = require('./repositories/habitRepositoryPrisma');

//pruebas, no estara en la app
const cargarHabitosRoutes = require('./routes/cargarhabitos');
//
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("hola"));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    const { error } = req.query;
    res.render('Index', { error });
});
app.get('/Registro', (req, res) => {
    const { error } = req.query;
    res.render('Registro', { error });
});

app.get('/Bienvenida', authMiddleware, (req, res) => {
    res.render('Bienvenida');
});

app.get('/OlvidarContrasena', (req, res) => {
    res.render('OlvidarContrasena');
});

app.get('/ingresarcodigo', (req, res) => {
    res.render('Ingresarcodigo');
});

app.get('/cambiocontrasena', (req, res) => {
    res.render('Cambiocontrasena');
});

app.get('/calendario_emociones', authMiddleware, renderCalendar);

app.get('/racha', authMiddleware, (req, res) => {
    res.render('Racha');
});

app.get('/Inicio', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      userName: true,
      profilePic: true,
      bienvenidaMostrada: true
    }
  });

  if (!user.bienvenidaMostrada) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { bienvenidaMostrada: true }
    });
    return res.redirect('/Bienvenida');
  }

  const unreadNotifications = await countUnreadNotifications(req.user.id) || 0;

  res.render('Inicio', {
    userName: user.userName,
    profilePic: user.profilePic,
    unreadNotifications
  });
});

app.get('/EstadoDeAnimo', authMiddleware, (req, res) => {
    user=req.user;
    res.render('EstadodeAnimo',{user});
});
app.get('/GuiadeUsuario', authMiddleware, (req, res) => {
    res.render('GuiadeUsuario');
});

app.get('/TerminosyCondiciones', (req, res) => {
    res.render('TerminosyCondiciones');
});

app.get('/Notificaciones', authMiddleware, async (req, res) => {
    const notifications = await getRecentNotifications(req.user.id);
    markAllAsRead(req.user.id);
    
    const notificationsIcon = notifications.map(n => ({
    ...n,
    icon: getHabitIcon(n.title)
    }));
    res.render('Notificaciones', {
        notifications, notificationsIcon
    });
});

app.get('/GestionarMisHabitos', authMiddleware, (req, res) => {
    res.render('GestionarMisHabitos');
});

app.get('/MovimientoCorporal', authMiddleware, (req, res) => {
    res.render('MovimientoCorporal');
});

app.get('/Mental', authMiddleware, (req, res) => {
    res.render('Mental');
});

app.get('/Bienestar', authMiddleware, (req, res) => {
    res.render('Bienestar');
});

app.get('/EliminarCuenta', authMiddleware, (req, res) => {
    res.render('EliminarCuenta');
});

app.get('/EliminarCuenta1', authMiddleware, (req, res) => {
    res.render('EliminarCuenta1');
});

app.get('/EliminarCuenta2', authMiddleware, (req, res) => {
    res.render('EliminarCuenta2');
});

app.get('/Privacidad', authMiddleware, (req, res) => {
    res.render('Privacidad');
});

app.get('/FaltaDeTiempo', authMiddleware, (req, res) => {
    res.render('Faltadetiempo');
});

app.get('/UsoFinit', authMiddleware, (req, res) => {
    res.render('Usofinit');
});

app.get('/personalizado', authMiddleware, (req, res) => {
    res.render('HabitoPersonalizado',{ habit: null });
});

app.get('/actualizarPerfil', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if (!user) {
            return res.redirect('/login');
        }
        res.render('ActualizarPerfil', { user });
    } catch (err) {
        console.error('Error al cargar el perfil:', err);
        res.status(500).send('Error al cargar el perfil');
    }
});

app.get('/quienesSomos', authMiddleware, (req, res) => {
    res.render('QuienesSomos');  //
});

app.get('/GestionarHabitos', authMiddleware, (req, res) => {
    res.render('GestionarHabitos');
});

// CREAR hábito personalizado
app.get('/personalizado', authMiddleware, (req, res) => {
    res.render('HabitoPersonalizado', { habit: null }); // crear
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
        res.render('HabitoPersonalizado', { habit }); // editar
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
            },
            include: {
                logs: true
            }
        });

        if (!habit) return res.status(404).send('Hábito no encontrado');

        const completedLogs = habit.logs.filter(
            (log) => log.status.toLowerCase() === 'completed'
        );

        res.render('Perso', { 
            habit: {
                ...habit,
                completedDays: completedLogs.length
            } 
        }); // ver gráficas
    } catch (error) {
        console.error('Error al cargar el hábito personalizado:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

// Crear nuevo hábito correr
app.get('/GestionarCorrer', authMiddleware, (req, res) => {
  res.render('Gestionarcorrer', { habit: null });
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

        res.render('Gestionarcorrer', { habit });
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

        res.render('Correr', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});

// Crear nuevo hábito bicicleta
app.get('/gestionarbicicleta', authMiddleware, (req, res) => {
  res.render('Gestionarbicicleta', { habit: null });
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

        res.render('Gestionarbicicleta', { habit });
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

        res.render('Bicicleta', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});
// Crear nuevo hábito CuidadoPiel
app.get('/gestionarcuidadopiel', authMiddleware, (req, res) => {
  res.render('Gestionarcuidadopiel', { habit: null });
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
        res.render('Gestionarcuidadopiel', { habit });
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
  res.render('GestionarDesintoxicacionDigital', { habit: null });
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
        res.render('GestionarDesintoxicacionDigital', { habit });
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
        res.render('DesintoxicacionDigital', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito Estiramientos
app.get('/gestionarestiramientos', authMiddleware, (req, res) => {
  res.render('Gestionarestiramientos', { habit: null });
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
        res.render('Gestionarestiramientos', { habit });
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
  res.render('Gestionarhidratacion', { habit: null });
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
        res.render('Gestionarhidratacion', { habit });
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
  res.render('Gestionarhorasdormir', { habit: null });
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
        res.render('Gestionarhorasdormir', { habit });
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
        res.render('Horasdormir', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito Lectura
app.get('/gestionarlectura', authMiddleware, (req, res) => {
  res.render('Gestionarlectura', { habit: null });
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
        res.render('Gestionarlectura', { habit });
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
  res.render('Gestionarmeditacion', { habit: null });
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
        res.render('Gestionarmeditacion', { habit });
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
  res.render('Gestionarmusicarelajante', { habit: null });
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
        res.render('Gestionarmusicarelajante', { habit });
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
  res.render('Gestionarordenarespacio', { habit: null });
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
        res.render('Gestionarordenarespacio', { habit });
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
        res.render('Ordenarespacio', { habit });
    } catch (error) {
        console.error('Error al cargar el hábito:', error);
        res.status(500).send('Error al cargar el hábito');
    }
});


// Crear nuevo hábito SaltarCuerda
app.get('/gestionarsaltarcuerda', authMiddleware, (req, res) => {
  res.render('Gestionarsaltarcuerda', { habit: null });
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
        res.render('Gestionarsaltarcuerda', { habit });
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
    res.render('ConfigNotis', {
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
