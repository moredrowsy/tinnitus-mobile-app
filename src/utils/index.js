export function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result);
    reader.onerror = (_e) => reject(reader.error);
    reader.onabort = (_e) => reject(new Error('Read aborted'));
    reader.readAsDataURL(blob);
  });
}

export function formatDate(timestamp) {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString('en-US');
  return time.substring(0, 5) + time.slice(-2) + ' | ' + d.toLocaleDateString();
}

// Shuffle / randomize array elements
// The Fisher-Yates algorith
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
