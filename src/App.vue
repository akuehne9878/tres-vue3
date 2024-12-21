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
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { loadParts, createParametersMap, computeDimensions, computePosition, degreesToRadians, getEdgesGeometry, lineMaterial, parts } from './composables';

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
