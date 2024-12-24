<template>
  <div class="app-container">
    <header class="header">
      <span>My App</span>
      <button @click="saveJson">Speichern</button>
    </header>
    <div class="content">
      <nav class="navigator">
        <Navigator v-if="model !== undefined" :assemblies="model.assemblies" :parameters="model.parameters" @current-assembly-changed="currentAssemblyChanged" @current-parameter-changed="currentParameterChanged" />
      </nav>
      <main class="main-content">
        <div class="canvas-container">
          <TresCanvas preset="realistic" class="tres-canvas">
            <OrbitControls />
            <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
            <TresAmbientLight intensity="0.7" />
            <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

            <TresGroup v-if="computedAssemblies" v-for="assembly in computedAssemblies" :key="assembly.key">
              <AssemblyRenderer :assembly="assembly" />
            </TresGroup>

            <TresAxesHelper :args="[1000]" />
          </TresCanvas>
        </div>
      </main>
      <aside class="sidebar">
       <Detail :element="selectedElement" :parameter="selectedParameter" @name-updated="updateElementName" @position-updated="updateElementPosition" @rotation-updated="updateElementRotation" @parameter-updated="updateParameter" />
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { loadModel, model, replaceParameters, createParametersMap, computePosition, computeArgs, getGeometry } from './composables';
import AssemblyRenderer from './AssemblyRenderer.vue';
import Navigator from './Navigator.vue';
import Detail from './Detail.vue';
import { Assembly, Part, Parameter } from './types';

onMounted(() => {
  loadModel('/src/components.json');
});

let selectedElement = ref<Assembly | Part | null>(null);
let selectedParameter = ref<Parameter | null>(null);

function currentAssemblyChanged(element: Assembly | Part) {
  selectedElement.value = element;
  selectedParameter.value = null; // Deselect parameter
}

function currentParameterChanged(parameter: Parameter) {
  selectedParameter.value = parameter;
  selectedElement.value = null; // Deselect element
}

function updateElementName(newName: string) {
  if (selectedElement.value) {
    selectedElement.value.name = newName;
  }
}

function updateElementPosition(newPosition: [number, number, number]) {
  if (selectedElement.value) {
    selectedElement.value.position = newPosition;
  }
}

function updateElementRotation(newRotation: [number, number, number]) {
  if (selectedElement.value) {
    selectedElement.value.rotation = newRotation;
  }
}

function updateParameter(updatedParam: { name: string; value: string | number; unit: string }) {
  if (selectedParameter.value) {
    selectedParameter.value.name = updatedParam.name;
    selectedParameter.value.value = updatedParam.value;
    selectedParameter.value.unit = updatedParam.unit;

    createParametersMap();
  }
}

const computedParametersMap = computed(() => {
  const parametersMap: Record<string, number> = {};
  model.value?.parameters.forEach(param => {
    parametersMap[param.name] = eval(replaceParameters(param.value.toString(), parametersMap));
  });
  return parametersMap;
});

const computedAssemblies = computed(() => {
  if (!model.value) return [];
  return model.value.assemblies.map(assembly => ({
    ...assembly,
    position: computePosition(assembly.position, computedParametersMap.value),
    rotation: computePosition(assembly.rotation, computedParametersMap.value),
    parts: assembly.parts.map(part => ({
      ...part,
      position: computePosition(part.position, computedParametersMap.value),
      rotation: computePosition(part.rotation, computedParametersMap.value),
      args: computeArgs(getGeometry(part.geometryReference), computedParametersMap.value),
    })),
    assemblies: assembly.assemblies?.map(subAssembly => ({
      ...subAssembly,
      position: computePosition(subAssembly.position, computedParametersMap.value),
      rotation: computePosition(subAssembly.rotation, computedParametersMap.value),
      parts: subAssembly.parts.map(part => ({
        ...part,
        position: computePosition(part.position, computedParametersMap.value),
        rotation: computePosition(part.rotation, computedParametersMap.value),
        args: computeArgs(getGeometry(part.geometryReference), computedParametersMap.value),
      })),
    }))
  }));
});

function saveJson() {
  const jsonContent = JSON.stringify(model.value, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'components.json';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px;
}

.header button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.content {
  display: flex;
  flex: 1;
}

.navigator {
  width: 300px;
  background-color: #f8f8f8;
  padding: 10px;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: calc(100vw - 600px);
}

.sidebar {
  width: 300px;
  background-color: #f0f0f0;
  padding: 10px;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}
</style>
