export default interface ICity {
    name: string,
    area: number,
    population: number,
    density?: number,
}

export const appropriateSortProperties = ['name', 'area', 'property'];