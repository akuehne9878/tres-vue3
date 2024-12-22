<template>
  <TresCanvas window-size preset="realistic">
    <OrbitControls />
    <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
    <TresAmbientLight intensity="0.7" />
    <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

    <TresGroup v-if="model !== undefined" v-for="assembly in model?.assembly ? [model.assembly] : []" :key="assembly.name">
      <AssemblyRenderer :assembly="assembly" />
    </TresGroup>

    <TresAxesHelper :args="[1000]" />
  </TresCanvas>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { loadModel, model } from './composables';
import AssemblyRenderer from './AssemblyRenderer.vue';

onMounted(() => {
  loadModel('/src/components.json');
});
</script>

<style scoped>
.renderer-container {
  width: 100vw;
  height: 100vh;
}
</style>
