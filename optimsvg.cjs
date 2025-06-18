const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

// Directorio de entrada donde están las imágenes
const inputDir = './src/img';
const outputDir = './public/img/svg';  

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const convertImageToSVG = async (inputPath, outputPath) => {
    try {
        const image = await sharp(inputPath).toBuffer();

        potrace.trace(image, function(err, svg) {
            if (err) {
                console.error('Error durante el tracing:', err);
            } else {
                fs.writeFileSync(outputPath, svg);
                console.log('Conversión completada, SVG guardado en', outputPath);
            }
        });
    } catch (error) {
        console.error('Error en el proceso de conversión:', error);
    }
};

// Función para procesar todas las imágenes en el directorio de entrada
const processAllImages = async () => {
    try {
        const files = fs.readdirSync(inputDir);

        const imageFiles = files.filter(file => 
            file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png')
        );

        for (let file of imageFiles) {
            const inputPath = path.join(inputDir, file);
            const outputFile = path.parse(file).name + '.svg'; 
            const outputPath = path.join(outputDir, outputFile);

            await convertImageToSVG(inputPath, outputPath);  // Convierte y guarda el archivo SVG
        }

        console.log('Conversión de todas las imágenes completada.');
    } catch (error) {
        console.error('Error al procesar las imágenes:', error);
    }
};

processAllImages();
