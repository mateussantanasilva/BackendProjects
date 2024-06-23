export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Maximum number of check-ins on the same date')
  }
}
