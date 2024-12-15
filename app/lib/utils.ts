type ArrayType<T> = T[];

export const shuffleObjects = (
  objects: ArrayType<Object>
): ArrayType<Object> => {
  let arr: ArrayType<Object> = objects;
  for (var i = arr.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }

  return arr;
};
