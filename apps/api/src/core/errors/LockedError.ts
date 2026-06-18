export class LockedError extends Error {
  constructor(err: Error) {
    super(err.message);
  }
}
