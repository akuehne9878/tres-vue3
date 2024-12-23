<template>
    <ul>
        <li v-for="child in children" :key="child.key">
            <a @click="$emit('currentAssemblyChanged', child)">Assembly {{ child.name }}</a> <!-- Ändere den Parameter zu `child` -->

            <ul>
                <li v-for="part in child.parts" :key="part.key">
                    <a @click="$emit('currentAssemblyChanged', part)">Part: {{ part.name }}</a> <!-- Event für Parts hinzufügen -->
                </li>
            </ul>
            <NavigatorItem v-if="child.assemblies" :children="child.assemblies" @current-assembly-changed="$emit('currentAssemblyChanged', $event)" />
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { Assembly } from './types';

defineProps<{
    children: Assembly[];
}>();

defineEmits(['currentAssemblyChanged']);
</script>
