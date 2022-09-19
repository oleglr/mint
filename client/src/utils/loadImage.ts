export function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = src
  })
}
