<template>
    <TresGroup :position="computePosition(assembly.position)" :rotation="degreesToRadians(assembly.rotation)" >
        <template v-for="part in assembly.parts" :key="part.name">
            <TresMesh
                v-if="getGeometry(part.geometryReference)?.geometry !== 'Line' && getGeometry(part.geometryReference)?.geometry !== 'Text'"
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
        <template v-for="childAssembly in assembly.assemblies || []" :key="childAssembly.key">
            <AssemblyRenderer :assembly="childAssembly" />
        </template>
    </TresGroup>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { Text3D } from '@tresjs/cientos';
import { getGeometry, computeArgs, computePosition, degreesToRadians, getEdgesGeometry, createGeometry, createLineGeometry, lineMaterial } from './composables';
import { Assembly } from './types';

const fontPath = '/src/assets/FiraCodeRegular.json';

defineProps<{
    assembly: Assembly
}>();
</script>