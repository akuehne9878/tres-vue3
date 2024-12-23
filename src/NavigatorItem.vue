<template>
    <ul>
      <li v-for="child in children" :key="child.name">
        {{ child.name }}
        <ul>
          <li v-for="part in child.parts" :key="part.id">
            - {{ part.id }}
          </li>
        </ul>
        <NavigatorItem v-if="child.children" :children="child.children" />
      </li>
    </ul>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  import { Assembly } from './types';
  
  defineProps<{
    children: Assembly[];
  }>();
  </script>
  