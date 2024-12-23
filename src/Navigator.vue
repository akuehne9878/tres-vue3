<template>
    <div class="navigator">
        <NavigatorItem v-if="assemblies" :children="assemblies"  @current-assembly-changed="$emit('currentAssemblyChanged', $event)" />
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import NavigatorItem from './NavigatorItem.vue';
import { Assembly } from './types';

defineProps<{
    assemblies: Assembly[];
}>();

defineEmits(['currentAssemblyChanged']);

</script>