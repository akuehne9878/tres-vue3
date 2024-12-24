<template>
    <div class="navigator">
      <div class="tabs">
        <button :class="{ active: currentTab === 'assemblies' }" @click="currentTab = 'assemblies'">Assemblies</button>
        <button :class="{ active: currentTab === 'parameters' }" @click="currentTab = 'parameters'">Parameter</button>
      </div>
      <div v-if="currentTab === 'assemblies'">
        <NavigatorItem v-if="assemblies" :children="assemblies" @current-assembly-changed="$emit('currentAssemblyChanged', $event)" />
      </div>
      <div v-if="currentTab === 'parameters'">
        <ul>
          <li v-for="param in parameters" :key="param.name">
            <a @click="$emit('currentParameterChanged', param)">Parameter {{ param.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import NavigatorItem from './NavigatorItem.vue';
  import { Assembly, Parameter } from './types';
  
  const currentTab = ref('assemblies');
  
  const props = defineProps<{
    assemblies: Assembly[];
    parameters: Parameter[];
  }>();
  
  defineEmits(['currentAssemblyChanged', 'currentParameterChanged']);
  </script>
  
  <style scoped>
  .navigator {
    /* Styles for navigator */
  }
  
  .tabs {
    display: flex;
  }
  
  .tabs button {
    flex: 1;
    padding: 10px;
    cursor: pointer;
  }
  
  .tabs .active {
    background-color: #ddd;
  }
  </style>
  