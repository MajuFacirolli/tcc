export class UnauthorizedError extends Error {
  constructor(err: Error | string) {
    super(typeof err === "string" ? err : err.message);
  }
}
