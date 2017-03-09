
export function unrequire() {
  delete require.cache[require.resolve('config')];
  delete require.cache[require.resolve('winston')];
  delete require.cache[require.resolve('../..')];
}
