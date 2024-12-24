<template>
    <div>
      <h3>Detail View</h3>
      <div v-if="element">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" @input="$emit('name-updated', name)" />
  
        <div class="position">
          <h4>Position</h4>
          <label for="x">X:</label>
          <input type="text" id="x" v-model="position.x" @input="updatePosition('x', position.x)" />
          <span>{{ computedPosition.x }}</span>
          <label for="y">Y:</label>
          <input type="text" id="y" v-model="position.y" @input="updatePosition('y', position.y)" />
          <span>{{ computedPosition.y }}</span>
          <label for="z">Z:</label>
          <input type="text" id="z" v-model="position.z" @input="updatePosition('z', position.z)" />
          <span>{{ computedPosition.z }}</span>
        </div>
  
        <div class="rotation">
          <h4>Rotation</h4>
          <label for="rx">X:</label>
          <input type="text" id="rx" v-model="rotation.x" @input="updateRotation('x', rotation.x)" />
          <span>{{ computedRotation.x }}</span>
          <label for="ry">Y:</label>
          <input type="text" id="ry" v-model="rotation.y" @input="updateRotation('y', rotation.y)" />
          <span>{{ computedRotation.y }}</span>
          <label for="rz">Z:</label>
          <input type="text" id="rz" v-model="rotation.z" @input="updateRotation('z', rotation.z)" />
          <span>{{ computedRotation.z }}</span>
        </div>
      </div>
      <div v-if="parameter">
        <label for="param-name">Name:</label>
        <input type="text" id="param-name" v-model="paramName" @input="updateParameter" />
        
        <label for="param-value">Wert:</label>
        <input type="text" id="param-value" v-model="paramValue" @input="updateParameter" />
        
        <label for="param-unit">Einheit:</label>
        <input type="text" id="param-unit" v-model="paramUnit" @input="updateParameter" />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { Assembly, Part, Parameter } from './types';
  import { replaceParameters } from './composables';
  
  const props = defineProps<{
    element: Assembly | Part | null;
    parameter: Parameter | null;
  }>();
  
  const emit = defineEmits(['name-updated', 'position-updated', 'rotation-updated', 'parameter-updated']);
  
  const name = ref('');
  const position = ref({ x: '', y: '', z: '' });
  const rotation = ref({ x: '', y: '', z: '' });
  
  const paramName = ref('');
  const paramValue = ref('');
  const paramUnit = ref('');
  
  watch(
    () => props.element,
    (newElement) => {
      if (newElement) {
        name.value = newElement.name;
        position.value = { x: newElement.position[0], y: newElement.position[1], z: newElement.position[2] };
        rotation.value = { x: newElement.rotation[0], y: newElement.rotation[1], z: newElement.rotation[2] };
      }
    }
  );
  
  watch(
    () => props.parameter,
    (newParameter) => {
      if (newParameter) {
        paramName.value = newParameter.name;
        paramValue.value = newParameter.value.toString();
        paramUnit.value = newParameter.unit;
      }
    }
  );
  
  const computedPosition = computed(() => {
    return {
      x: eval(replaceParameters(position.value.x + "")),
      y: eval(replaceParameters(position.value.y+ "")),
      z: eval(replaceParameters(position.value.z+ ""))
    };
  });
  
  const computedRotation = computed(() => {
    return {
      x: eval(replaceParameters(rotation.value.x+ "")),
      y: eval(replaceParameters(rotation.value.y+ "")),
      z: eval(replaceParameters(rotation.value.z+ ""))
    };
  });
  
  function updatePosition(axis: 'x' | 'y' | 'z', value: string) {
    if (props.element) {
      props.element.position[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = value;
      emit('position-updated', [computedPosition.value.x, computedPosition.value.y, computedPosition.value.z]);
    }
  }
  
  function updateRotation(axis: 'x' | 'y' | 'z', value: string) {
    if (props.element) {
      props.element.rotation[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = value;
      emit('rotation-updated', [computedRotation.value.x, computedRotation.value.y, computedRotation.value.z]);
    }
  }
  
  function updateParameter() {
    emit('parameter-updated', { name: paramName.value, value: paramValue.value, unit: paramUnit.value });
  }
  </script>
  
  <style scoped>
  .position, .rotation {
    margin-top: 10px;
  }
  
  .position label, .rotation label, .parameter label {
    margin-right: 5px;
  }
  
  .position input, .rotation input, .parameter input {
    margin-bottom: 5px;
  }
  
  span {
    margin-left: 10px;
    font-weight: bold;
  }
  </style>
  