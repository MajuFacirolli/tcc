export class ForbiddenError extends Error {
  constructor(err: Error) {
    super(err.message);
  }
}
