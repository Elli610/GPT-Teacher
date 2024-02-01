export function randomSelection(array: any[]) {
  const index = Math.floor(Math.random() * array.length);
  console.log("random part: ", index, array[index]);
  return array[index];
}