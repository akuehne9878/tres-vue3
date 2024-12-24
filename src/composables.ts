import { ref, computed } from 'vue';
import { BoxGeometry, CylinderGeometry, BufferGeometry, EdgesGeometry, LineBasicMaterial, Line, Vector3, Float32BufferAttribute, MeshBasicMaterial, Mesh } from 'three';
import { Assembly, Part, Parameter, Model, Geometry } from './types';

export const model = ref<Model>();

const parametersMap = ref<Record<string, number>>({});

export const loadModel = async (filename: string) => {
  const response = await fetch(filename);
  const data: Model = await response.json();

  model.value = data;
  createParametersMap();
};

export const createParametersMap = () => {
  model.value?.parameters.forEach(param => {
    parametersMap.value[param.name] = eval(replaceParameters(param.value.toString()));
  });
};

export const replaceParameters = (str: string, customParams: Record<string, number> = parametersMap.value) => {
  const regex = /\$\{(\w+)\}/g;
  return str.replace(regex, (_, key) => {
    return customParams[key]?.toString() || '0';
  });
};

export const computeArgs = (geometry: Geometry | undefined, customParams: Record<string, number> = parametersMap.value): any[] => {
  return geometry?.args.map(arg => {
    if (Array.isArray(arg)) {
      return arg.map(innerArg => (typeof innerArg === 'string' ? eval(replaceParameters(innerArg, customParams)) : innerArg));
    }

    if (typeof arg === 'string' && arg.includes('$')) {
      return eval(replaceParameters(arg, customParams));
    }
    return arg;
  }) || [];
};

export const computePosition = (pos: (number | string)[], customParams: Record<string, number> = parametersMap.value): [number, number, number] => {
  return pos.map(p =>
    typeof p === 'string' ? eval(replaceParameters(p, customParams)) : p
  ) as [number, number, number];
};

export const computeRotation = (pos: (number | string)[], customParams: Record<string, number> = parametersMap.value): [number, number, number] => {
  return pos.map(p =>
    typeof p === 'string' ? eval(replaceParameters(p, customParams)) : p
  ) as [number, number, number];
};

export const degreesToRadians = (degrees: number[], customParams: Record<string, number> = parametersMap.value): [number, number, number] => {
  return degrees.map(d => (d * Math.PI) / 180) as [number, number, number];
};

export const getEdgesGeometry = (geometryReference: string) => {
  const geometry: BufferGeometry = createGeometry(geometryReference);
  return new EdgesGeometry(geometry);
};

export const getGeometry = (geometryReference: string, customParams: Record<string, number> = parametersMap.value): Geometry | undefined => {
  return model.value?.geometries[geometryReference];
}

export const createGeometry = (geometryReference: string, customParams: Record<string, number> = parametersMap.value): BufferGeometry => {
  const geometry = getGeometry(geometryReference, customParams);
  const args = computeArgs(geometry, customParams);
  switch (geometry?.geometry) {
    case 'Box':
      return new BoxGeometry(...args);
    case 'Cylinder':
      return new CylinderGeometry(...args);
    default:
      return new BoxGeometry(...args);
  }
};

export const createLineGeometry = (geometryReference: string) => {
  const geometry = getGeometry(geometryReference);
  const args = computeArgs(geometry);
  const points = args.map((coord: number[]) => new Vector3(...coord)) || [];
  const lineGeometry = new BufferGeometry().setFromPoints(points);
  return new Line(lineGeometry, new LineBasicMaterial({ color: 0x0000ff }));
};
export const lineMaterial = new LineBasicMaterial({ color: 0x000000 });

export let currAssembly = ref<Assembly>();
