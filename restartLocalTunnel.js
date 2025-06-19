const { exec } = require('child_process');
const path = require('path');

function startLocaltunnel() {
    const ltCommand = 'lt --port 3000 --subdomain=finit'; 
    const ltProcess = exec(ltCommand);

    ltProcess.stdout.on('data', (data) => {
        console.log(data);
    });

    ltProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    ltProcess.on('close', (code) => {
        if (code !== 0) {
            console.log(`Localtunnel se cerró con código ${code}. Reiniciando...`);
            startLocaltunnel(); // REINICIAR
        }
    });
}

startLocaltunnel();
