export class UnauthorizedError extends Error {
  constructor(err: Error) {
    super(err.message);
  }
}
