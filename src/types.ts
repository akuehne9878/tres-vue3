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
  key: string;
  name: string;
  geometryReference: string;
  position: (number | string)[];
  rotation: (number | string)[];
}

export interface Assembly {
  key: string;
  name: string;
  parts: Part[];
  assemblies?: Assembly[];
  position: (number | string)[];
  rotation: (number | string)[];
}

export interface Model {
  parameters: Parameter[];
  geometries: Record<string, Geometry>;
  assemblies: Assembly[];
}