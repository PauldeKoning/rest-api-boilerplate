export function stringGuard(input: string, min: number, max: number): void {
    if (input.length < min || input.length > max)
        throw Error(`String ${input} is lower than min value ${min} or exceeds max value ${max}`);
}