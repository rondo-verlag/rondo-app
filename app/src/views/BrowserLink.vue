<template>
  <a :href="url" target="_blank"><slot></slot></a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BrowserLink',
  props: {
    url: String
  },
});
</script>
