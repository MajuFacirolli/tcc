export class MapperError extends Error {
  readonly property: string;

  constructor(message: string, property: string) {
    super(message);
    this.name = "MapperError";
    this.property = property;
  }
}
