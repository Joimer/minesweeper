export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function red(msg: string): string {
    return "\x1b[31m" + msg + "\x1b[0m";
}

export function green(msg: string): string {
    return "\x1b[32m" + msg + "\x1b[0m";
}

export function cyanBg(msg: string): string {
    return "\x1b[46m\x1b[30m" + msg + "\x1b[0m";   
}

export function redBg(msg: string): string {
    return "\x1b[41m\x1b[30m" + msg + "\x1b[0m";   
}

export function blue(msg: string): string {
    return "\x1b[34m" + msg + "\x1b[0m";   
}
