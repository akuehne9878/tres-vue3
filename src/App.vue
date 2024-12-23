<template>
  <div class="app-container">
    <header class="header">My App</header>
    <div class="content">
      <nav class="navigator">
        <Navigator v-if="model !== undefined" :assemblies="[model.assembly]" />
      </nav>
      <main class="main-content">
        <div class="canvas-container">
          <TresCanvas preset="realistic" class="tres-canvas">
            <OrbitControls />
            <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
            <TresAmbientLight intensity="0.7" />
            <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

            <TresGroup v-if="model !== undefined" v-for="assembly in model?.assembly ? [model.assembly] : []" :key="assembly.name">
              <AssemblyRenderer :assembly="assembly" />
            </TresGroup>

            <TresAxesHelper :args="[1000]" />
          </TresCanvas>
        </div>
      </main>
      <aside class="sidebar">
        <!-- Additional information or controls can go here -->
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

onMounted(() => {
  loadModel('/src/components.json');
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
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
