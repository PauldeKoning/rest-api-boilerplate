import UserInputError from '../util/error/user.input.error';

export function stringGuard(input: string, min: number, max: number) {
  if (input.length < min || input.length > max) throw new UserInputError(`String ${input} is lower than min value ${min} or exceeds max value ${max}`);
}
