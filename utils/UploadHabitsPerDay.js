const cron = require('node-cron');
const { generateDailyHabitLog } = require('../controllers/habitController');

cron.schedule('0 1 * * *', async () => {
console.log('generar logs de hábitos por dia');

try {
    await generateDailyHabitLog(
    { auto: true },
    {
    status: () => ({
        json: (msg) => console.log(msg)
    })
    }
    );
} catch (error) {
    console.error(error);
}
});
