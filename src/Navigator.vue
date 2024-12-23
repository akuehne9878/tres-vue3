<template>
    <div class="navigator">
      <ul>
        <li v-for="assembly in assemblies" :key="assembly.name">
          {{ assembly.name }}
          <ul>
            <li v-for="part in assembly.parts" :key="part.id">
              {{ part.id }}
            </li>
          </ul>
          <NavigatorItem v-if="assembly.children" :children="assembly.children" />
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  import NavigatorItem from './NavigatorItem.vue';
  import { Assembly } from './types';
  
  defineProps<{
    assemblies: Assembly[];
  }>();
  </script>
  