import { ref } from 'vue';
import { BoxGeometry, EdgesGeometry, LineBasicMaterial } from 'three';
import { Assembly, Part, Parameter, Config } from './model/types';

const partsConfig = ref<Record<string, Part>>({});
const parameters = ref<Parameter[]>([]);
const parametersMap = ref<Record<string, number>>({});
export const parts = ref<Assembly[]>([]);

export const loadParts = async () => {
  const response = await fetch('/src/components_explosion.json');
  const data: Config = await response.json();
  parameters.value = data.parameters;
  partsConfig.value = data.parts;
  parts.value = data.assembly;
};

export const createParametersMap = () => {
  parameters.value.forEach(param => {
    parametersMap.value[param.name] = eval(replaceParameters(param.value.toString()));
  });
};

export const replaceParameters = (str: string) => {
  const regex = /\$\{(\w+)\}/g;
  return str.replace(regex, (_, key) => {
    return parametersMap.value[key]?.toString() || '0';
  });
};

export const computeDimensions = (partName: string): [number, number, number] => {
  const part = partsConfig.value[partName];
  return [
    eval(replaceParameters(part.length)),
    eval(replaceParameters(part.width)),
    eval(replaceParameters(part.thickness))
  ];
};

export const computePosition = (pos: (number | string)[]): [number, number, number] => {
  return pos.map(p =>
    typeof p === 'string' ? eval(replaceParameters(p)) : p
  ) as [number, number, number];
};

export const degreesToRadians = (degrees: number[]): [number, number, number] => {
  return degrees.map(d => (d * Math.PI) / 180) as [number, number, number];
};

export const getEdgesGeometry = (dimensions: [number, number, number]) => {
  return new EdgesGeometry(new BoxGeometry(...dimensions));
};

export const lineMaterial = new LineBasicMaterial({ color: 0x000000 });
