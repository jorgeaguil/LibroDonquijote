const fs = require('fs');
const natural = require('natural');
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();
const PDFParser = require('pdf-parse');

// Ruta al archivo PDF
const pdfFilePath = 'Don_Quijote_de_la_Mancha-Cervantes_Miguel.pdf';

// Lee el contenido del PDF y cuenta las palabras
const contarPalabrasEnPDF = async () => {
  try {
    const dataBuffer = fs.readFileSync(pdfFilePath);
    const data = await PDFParser(dataBuffer);

    // Obtén el texto del PDF
    let textoPDF = data.text;

    // Limpia el texto: convierte a minúsculas, elimina signos de puntuación, números y espacios extra
    textoPDF = textoPDF.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/[0-9]/g, '').replace(/\s{2,}/g," ");

    // Divide el texto en palabras
    const palabras = textoPDF.split(/\s+/);

    // Agrega el texto al modelo TF-IDF
    tfidf.addDocument(textoPDF);

    // Crea un objeto para almacenar el recuento de palabras
    const recuentoPalabras = {};

    // Cuenta las palabras y su frecuencia
    palabras.forEach(palabra => {
      palabra = palabra.trim();
      if (palabra !== '') {
        if (recuentoPalabras[palabra]) {
          recuentoPalabras[palabra]++;
        } else {
          recuentoPalabras[palabra] = 1;
        }
      }
    });

    // Ordena las palabras por frecuencia descendente
    const palabrasOrdenadas = Object.keys(recuentoPalabras).sort((a, b) => recuentoPalabras[b] - recuentoPalabras[a]);

    // Muestra las palabras más repetidas y su puntuación TF-IDF
    console.log('Palabras más repetidas y su puntuación TF-IDF:');
    for (let i = 0; i < 50 && i < palabrasOrdenadas.length; i++) {
      const palabra = palabrasOrdenadas[i];
      console.log(`${palabra}: ${recuentoPalabras[palabra]} veces, puntuación TF-IDF: ${tfidf.tfidf(palabra, 0)}`);
    }

    // Muestra las palabras menos repetidas y su puntuación TF-IDF
    console.log('Palabras menos repetidas y su puntuación TF-IDF:');
    for (let i = palabrasOrdenadas.length - 1; i >= 0 && i >= palabrasOrdenadas.length - 50; i--) {
      const palabra = palabrasOrdenadas[i];
      console.log(`${palabra}: ${recuentoPalabras[palabra]} veces, puntuación TF-IDF: ${tfidf.tfidf(palabra, 0)}`);
    }

    // Muestra el total de palabras en el PDF
    const totalPalabras = palabras.length;
    console.log(`Total de palabras en el PDF: ${totalPalabras}`);
  } catch (error) {
    console.error('Error al contar las palabras en el PDF:', error);
  }
};

// Ejecuta la función
contarPalabrasEnPDF();