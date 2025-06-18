const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './src/img/sharki';
const outputDir = './public/img/sharki';

//Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const processImage = (filePath) => {
    const relativePath = path.relative(inputDir, filePath);
    const fileBaseName = path.parse(relativePath).name;
    const outputFileDir = path.join(outputDir, path.dirname(relativePath));

    //Create output directory
    if (!fs.existsSync(outputFileDir)) {
        fs.mkdirSync(outputFileDir, { recursive: true });
    }

    const ext = path.extname(filePath).toLowerCase();

    let outputOptions;
    let outputFile;

    if (ext === '.png') {
        outputOptions = sharp().png({ quality: 80 });
        outputFile = `${fileBaseName}.png`;
    } else if (ext === '.jpg' || ext === '.jpeg') {
        outputOptions = sharp().jpeg({ quality: 80 });
        outputFile = `${fileBaseName}.jpg`;
    } else {
        console.log(`Formato no soportado: ${filePath}`);
        return;
    }

    //Process and save image
    sharp(filePath)
        .pipe(outputOptions)
        .toFile(path.join(outputFileDir, outputFile), (err, info) => {
            if (err) {
                console.error(`Error al optimizar ${ext}: ${filePath}`, err);
            } else {
                console.log(`Imagen optimizada: ${outputFile}`, info);
            }
        });
};

//Find files (images)
const readDirRecursive = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            readDirRecursive(fullPath);
        } else if (
            ['.png', '.jpg', '.jpeg'].includes(path.extname(file).toLowerCase())
        ) {
            processImage(fullPath);
        }
    });
};

readDirRecursive(inputDir);