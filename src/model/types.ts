export interface Parameter {
    name: string;
    value: string | number;
    unit: string;
}

export interface Part {
    length: string;
    width: string;
    thickness: string;
}

export interface Assembly {
    id: string;
    part: string;
    position: (number | string)[];
    rotation: number[];
    measurements: number[];
}

export interface Config {
    parameters: Parameter[];
    parts: Record<string, Part>;
    assembly: Assembly[];
}
