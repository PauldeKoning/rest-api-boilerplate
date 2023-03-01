import UserInputError from '../util/error/user.input.error';

export function regexGuard(input: string, regex: string | RegExp) {
  if (!input.match(regex)) throw new UserInputError(`String ${input} does not match regex ${regex}`);
}
