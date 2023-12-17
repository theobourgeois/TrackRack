function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}
const idGen = idGenerator();
export const getNewId = (): number => idGen.next().value as number;