function* idGenerator() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}
const idGen = idGenerator();
export const getNewID = () => idGen.next().value as number;