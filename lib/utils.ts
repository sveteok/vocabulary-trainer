type ArrayType<T> = T[];

export const shuffleObjects = (
  objects: ArrayType<object>
): ArrayType<object> => {
  const arr: ArrayType<object> = objects;
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }

  return arr;
};

export function getSelectedWordsQuantity() {
  const selectedWords: string[] = JSON.parse(
    localStorage.getItem("selectedWords") || "[]"
  );
  return selectedWords.length;
}
