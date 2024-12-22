export interface Parameter {
  name: string;
  value: string | number;
  unit: string;
}

export interface Geometry {
  geometry: string;
  args: any[];
}

export interface Part {
  id: string;
  geometryReference: string;
  position: (number | string)[];
  rotation: number[];
}

export interface Assembly {
  name: string;
  parts: Part[];
  children?: Assembly[];
}

export interface Model {
  parameters: Parameter[];
  geometries: Record<string, Geometry>;
  assembly: Assembly;
}
