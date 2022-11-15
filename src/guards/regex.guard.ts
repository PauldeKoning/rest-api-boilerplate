export function regexGuard(input: string, regex: string) {
    if (!input.match(regex))
        throw Error(`String ${input} does not match regex ${regex}`);
}