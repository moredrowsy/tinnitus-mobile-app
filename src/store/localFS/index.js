import * as FileSystem from 'expo-file-system';

export const soundsDir = FileSystem.documentDirectory + 'sounds/';

// Return directory Uri
export function getDirUri(dirName) {
  return FileSystem.documentDirectory + `${dirName}/`;
}

export function getFileUri(dirName, fileName) {
  return FileSystem.documentDirectory + `${dirName}/` + `${fileName}`;
}

// Checks if gif directory exists. If not, creates it
export async function ensureDirExists(dirUri) {
  const dirInfo = await FileSystem.getInfoAsync(dirUri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
  }
}

export function checkFileExists(fileUri) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        resolve(false);
      }
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

export function readStringFromLocalAsync(fileUri) {
  return new Promise(async (resolve, reject) => {
    try {
      const datURL = await FileSystem.readAsStringAsync(fileUri);
      resolve(datURL);
    } catch (e) {
      reject(e);
    }
  });
}

export function writeStringToLocalAsync(fileUri, contents) {
  return new Promise(async (resolve, reject) => {
    try {
      await FileSystem.writeAsStringAsync(fileUri, contents);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

// Deletes whole giphy directory with all its content
export function deleteDir(dir) {
  return new Promise(async (resolve, reject) => {
    try {
      await FileSystem.deleteAsync(dir);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
