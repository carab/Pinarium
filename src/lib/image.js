export function resize(image, max) {
  const canvas = document.createElement('canvas');
  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > max) {
      height *= max / width;
      width = max;
    }
  } else {
    if (height > max) {
      width *= max / height;
      height = max;
    }
  }

  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg');
}

export function blobify(dataUrl) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}
