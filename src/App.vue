<template>
  <TresCanvas window-size preset="flat">
    <OrbitControls />
    <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
    <TresAmbientLight intensity="0.7" />
    <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

    <template v-for="part in model?.assembly.parts" :key="part.id">
      <component
        :is="getGeometry(part.geometryReference)?.geometry === 'Line' ? 'primitive' : 'TresMesh'"
        :object="getGeometry(part.geometryReference)?.geometry === 'Line' ? createLineGeometry(part.geometryReference) : createGeometry(part.geometryReference)"
        :position="computePosition(part.position)"
        :rotation="degreesToRadians(part.rotation)"
      >
        <TresBoxGeometry v-if="getGeometry(part.geometryReference)?.geometry !== 'Line'" :args="computeArgs(part.geometryReference)" />
        <TresMeshStandardMaterial v-if="getGeometry(part.geometryReference)?.geometry !== 'Line'" color="#D2B48C" />
      </component>
      <TresLineSegments v-if="getGeometry(part.geometryReference)?.geometry !== 'Line'"
        :geometry="getEdgesGeometry(part.geometryReference)"
        :material="lineMaterial"
        :position="computePosition(part.position)"
        :rotation="degreesToRadians(part.rotation)"
      />
    </template>

    <TresAxesHelper :args="[1000]" />
  </TresCanvas>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { loadModel, getGeometry, computeArgs, computePosition, degreesToRadians, getEdgesGeometry, createGeometry, createLineGeometry, lineMaterial, model } from './composables';

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

