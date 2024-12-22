import { ref } from 'vue';
import { BoxGeometry, CylinderGeometry, BufferGeometry, EdgesGeometry, LineBasicMaterial, Line, Vector3, Float32BufferAttribute } from 'three'; // Direkt aus 'three' importieren
import { Assembly, Part, Parameter, Model } from './types';

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

export const replaceParameters = (str: string) => {
    const regex = /\$\{(\w+)\}/g;
    return str.replace(regex, (_, key) => {
        return parametersMap.value[key]?.toString() || '0';
    });
};

export const computeArgs = (geometryReference: string): any[] => {
    const geometry = getGeometry(geometryReference);
    return geometry?.args.map(arg => (typeof arg === 'string' ? eval(replaceParameters(arg)) : arg)) || [];
};

export const computePosition = (pos: (number | string)[]): [number, number, number] => {
    return pos.map(p =>
        typeof p === 'string' ? eval(replaceParameters(p)) : p
    ) as [number, number, number];
};

export const degreesToRadians = (degrees: number[]): [number, number, number] => {
    return degrees.map(d => (d * Math.PI) / 180) as [number, number, number];
};

export const getEdgesGeometry = (geometryReference: string) => {
    const geometry : BufferGeometry =  createGeometry(geometryReference);
    return new EdgesGeometry(geometry);
};

export const getGeometry = (geometryReference: string) => {
    return model.value?.geometries[geometryReference];
}

export const createGeometry = (geometryReference: string) : BufferGeometry => {
    const geometry = getGeometry(geometryReference);
    const args = computeArgs(geometryReference);
    switch (geometry?.geometry) {
        case 'Box':
            return new BoxGeometry(...args);
        case 'Cylinder':
            return new CylinderGeometry(...args);
        default:
            return new BoxGeometry(...args); // Default zu BoxGeometry
    }
};

export const createLineGeometry = (geometryReference: string) => {
    const geometry = getGeometry(geometryReference);
    const points = geometry?.args.map((coord: number[]) => new Vector3(...coord)) || [];
    const lineGeometry = new BufferGeometry().setFromPoints(points);
    return new Line(lineGeometry, new LineBasicMaterial({ color: 0x0000ff }));
};

export const lineMaterial = new LineBasicMaterial({ color: 0x000000 });
