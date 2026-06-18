export class GenericError extends Error {
  constructor(err: Error) {
    super(err.message);
  }
}
