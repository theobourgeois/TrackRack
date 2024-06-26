/**
 * Increments the name of an entity if it already exists in the database
 * @param name entity's name
 * @param curr current increment/current number of entities with the same name
 */
export const incrementNameContainer = (name?: string, curr?: number) => {
    if (!name) return undefined;
    return curr == 0 ? encodeURIComponent(name) : `${encodeURIComponent(name)}-${curr ? curr + 1 : 1}`;
}

export const incrementName = (name?: string, curr?: number) => {
    return incrementNameContainer(name, curr)!;
}
