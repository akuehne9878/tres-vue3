<template>
    <TresCanvas window-size preset="flat">
      <OrbitControls />
      <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
      <TresAmbientLight intensity="0.7" />
      <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

      <template v-for="part in parts" :key="part.id">
        <TresMesh :position="computePosition(part.position)" :rotation="degreesToRadians(part.rotation)">
          <TresBoxGeometry :args="computeDimensions(part.part)" />
          <TresMeshStandardMaterial color="#D2B48C" />
        </TresMesh>
        <TresLineSegments :geometry="getEdgesGeometry(computeDimensions(part.part))" :material="lineMaterial"
          :position="computePosition(part.position)" :rotation="degreesToRadians(part.rotation)" />
      </template>

      <TresAxesHelper :args="[1000]" />
    </TresCanvas>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { BoxGeometry, BufferGeometry, EdgesGeometry, Float32BufferAttribute, LineBasicMaterial, Vector3 } from 'three';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';

interface Parameter {
  name: string;
  value: string | number;
  unit: string;
}

interface Part {
  length: string;
  width: string;
  thickness: string;
}

interface Assembly {
  id: string;
  part: string;
  position: (number | string)[];
  rotation: number[];
  measurements: number[];
}

interface Config {
  parameters: Parameter[];
  parts: Record<string, Part>;
  assembly: Assembly[];
}

const parts = ref<Assembly[]>([]);
const partsConfig = ref<Record<string, Part>>({});
const parameters = ref<Parameter[]>([]);

const loadParts = async () => {
  const response = await fetch('/src/components_explosion.json');
  const data: Config = await response.json();
  parameters.value = data.parameters;
  partsConfig.value = data.parts;
  parts.value = data.assembly;
};

const parametersMap = ref<Record<string, number>>({});

const createParametersMap = () => {
  parameters.value.forEach(param => {
    parametersMap.value[param.name] = eval(replaceParameters(param.value.toString()));
  });
};

const replaceParameters = (str: string) => {
  const regex = /\$\{(\w+)\}/g;
  return str.replace(regex, (_, key) => {
    return parametersMap.value[key]?.toString() || '0';
  });
};

const computeDimensions = (partName: string): [number, number, number] => {
  const part = partsConfig.value[partName];
  return [
    eval(replaceParameters(part.length)),
    eval(replaceParameters(part.width)),
    eval(replaceParameters(part.thickness))
  ];
};

const computePosition = (pos: (number | string)[]): [number, number, number] => {
  return pos.map(p =>
    typeof p === 'string' ? eval(replaceParameters(p)) : p
  ) as [number, number, number];
};

const degreesToRadians = (degrees: number[]): [number, number, number] => {
  return degrees.map(d => (d * Math.PI) / 180) as [number, number, number];
};

const getEdgesGeometry = (dimensions: [number, number, number]) => {
  return new EdgesGeometry(new BoxGeometry(...dimensions));
};

const lineMaterial = new LineBasicMaterial({ color: 0x000000 });

onMounted(() => {
  loadParts().then(createParametersMap);
});
</script>

<style scoped>
.renderer-container {
  width: 100vw;
  height: 100vh;
}
</style>
