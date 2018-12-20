const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const readDirectory = util.promisify(fs.readdir);

class TypescriptIsBetterLikeThat {

  static async readDirectory(directoryUrl) {
    let files = [];

    try {
      files = await readDirectory(directoryUrl);
    } catch (error) {
      console.log(`Erreur lors de la lecture du dossier ${directoryUrl}, `, error);
      return;
    }

    files.forEach((file) => {
      if (file.substring(file.length - 3) === ".js") {
        TypescriptIsBetterLikeThat.readFile(`${directoryUrl}/${file}`);
      } else {
        TypescriptIsBetterLikeThat.readDirectory(`${directoryUrl}/${file}`);
      }
    });
  }

  static async readFile(fileUrl) {
    let file = null;
    let fileContent = '';

    try {
      file = await readFile(fileUrl);
    } catch (error) {
      console.log(`Erreur lors de la lecture du fichier ${fileUrl}, `, error);
      return;
    }

    fileContent = file.toString();
    //TypescriptIsBetterLikeThat.javascriptThatPlease(fileContent);
    await TypescriptIsBetterLikeThat.writeFile(
      fileUrl,
      TypescriptIsBetterLikeThat.javascriptThatPlease(fileContent)
    );
  }

  static async writeFile(fileUrl, fileData) {
    try {
      await writeFile(fileUrl, fileData);
      console.log(`Fichier ${fileUrl} correctement modifié`)
    } catch (error) {
      console.log(`Erreur lors de l'écriture du fichier ${fileUrl}, `, error);
      return;
    }
  }

  static javascriptThatPlease(fileContent) {
    let standardFile = fileContent;

    let nextIndex = 0;
    let startReferenceString = 'import';
    let endReferenceRegex = /';|";/g;
    let identifierLength = standardFile.split(startReferenceString).length - 1;

    if (identifierLength > 0) {
      for (let x = 0; x < identifierLength; x++) {
        let referenceIndex = standardFile.indexOf(startReferenceString, nextIndex);

        if (referenceIndex != -1 && typeof referenceIndex != `undefined`) {
          let endReferenceIndex = referenceIndex + standardFile.substring(referenceIndex).search(endReferenceRegex);
          let parameterReference = standardFile.substring(referenceIndex, endReferenceIndex + 2);
          let quoteCharacter = parameterReference.substring(parameterReference.length - 2);
          let parameterModifiy = parameterReference.replace(endReferenceRegex, `.js${quoteCharacter}`);
          nextIndex = endReferenceIndex;
          console.log(parameterReference, quoteCharacter, parameterModifiy)
          standardFile = standardFile.replace(parameterReference, parameterModifiy);
        }
      }
    }

    //console.log(standardFile)
    return standardFile;
  }

}

//TypescriptIsBetterLikeThat.readFile('./lib/Box2D.js');
TypescriptIsBetterLikeThat.readDirectory('./lib');
