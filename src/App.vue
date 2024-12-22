<template>
  <TresCanvas window-size preset="realistic">
    <OrbitControls />
    <TresPerspectiveCamera :position="[1200, 1000, 1500]" :look-at="[0, 400, 250]" :far="5000" />
    <TresAmbientLight intensity="0.7" />
    <TresDirectionalLight :position="[1000, 1000, 500]" intensity="0.8" />

    <template v-for="part in model?.assembly.parts" :key="part.id">
      <TresMesh v-if="getGeometry(part.geometryReference)?.geometry !== 'Line' && getGeometry(part.geometryReference)?.geometry !== 'Text'"
        :object="createGeometry(part.geometryReference)" :position="computePosition(part.position)"
        :rotation="degreesToRadians(part.rotation)">
        <TresBoxGeometry :args="computeArgs(getGeometry(part.geometryReference))" />
        <TresMeshStandardMaterial color="#D2B48C" />
        <TresLineSegments :geometry="getEdgesGeometry(part.geometryReference)" :material="lineMaterial" />
      </TresMesh>
      <primitive v-if="getGeometry(part.geometryReference)?.geometry === 'Line'"
        :object="createLineGeometry(part.geometryReference)" :position="computePosition(part.position)"
        :rotation="degreesToRadians(part.rotation)">
      </primitive>
      <Suspense>
        <Text3D v-if="getGeometry(part.geometryReference)?.geometry === 'Text'" :font="fontPath"
        :text="getGeometry(part.geometryReference)?.args[0]" :position="computePosition(part.position)"
        :rotation="degreesToRadians(part.rotation)" :size="getGeometry(part.geometryReference)?.args[1]"
        :height="getGeometry(part.geometryReference)?.args[2]" color="black">
      </Text3D>
    </Suspense>
    </template>

    <TresAxesHelper :args="[1000]" />
  </TresCanvas>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Text3D } from '@tresjs/cientos';
import { loadModel, getGeometry, computeArgs, computePosition, degreesToRadians, getEdgesGeometry, createGeometry, createLineGeometry, lineMaterial, model } from './composables';


const fontPath = '/src/assets/FiraCodeRegular.json'

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
