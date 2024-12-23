<template>
  <div class="app-container">
    <header class="header">
      <span>My App</span>
      <button @click="saveJson">Speichern</button>
    </header>
    <div class="content">
      <nav class="navigator">
        <Navigator v-if="model !== undefined" :assemblies="model.assemblies" @current-assembly-changed="currentAssemblyChanged" />
      </nav>
      <main class="main-content" >
        <div class="canvas-container">
          <TresCanvas preset="realistic" class="tres-canvas">
            <OrbitControls />
            <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
            <TresAmbientLight intensity="0.7" />
            <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

            <TresGroup v-if="model !== undefined" v-for="assembly in model?.assemblies ? model.assemblies : []" :key="assembly.key">
              <AssemblyRenderer :assembly="assembly" />
            </TresGroup>

            <TresAxesHelper :args="[1000]" />
          </TresCanvas>
        </div>
      </main>
      <aside class="sidebar">
       <Detail :element="selectedElement" @name-updated="updateElementName" @position-updated="updateElementPosition" @rotation-updated="updateElementRotation" />
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { loadModel, model } from './composables';
import AssemblyRenderer from './AssemblyRenderer.vue';
import Navigator from './Navigator.vue';
import Detail from './Detail.vue';
import { Assembly, Part } from './types';

onMounted(() => {
  loadModel('/src/components.json');
});

let selectedElement = ref<Assembly | Part | null>(null);

function currentAssemblyChanged(element: Assembly | Part) {
  selectedElement.value = element;
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
