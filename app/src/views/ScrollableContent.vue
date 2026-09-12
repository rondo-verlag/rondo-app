<template>
  <div ref="scrollElement" class="scrollable" @scroll="manualScrollHandler">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScrollableContent',
  emits: ['onScrollUp', 'onScrollDown'],
  data() {
    return {
      lastScrollPosition: -1
    };
  },
  methods: {
    manualScrollHandler() {
      const currentPosition = this.getScrollPosition();
      if (this.lastScrollPosition > currentPosition) {
        this.$emit('onScrollUp');
      } else {
        // autoscroll is always +1, don't emit events on that
        const diff = currentPosition - this.lastScrollPosition;
        if (diff > 1 && currentPosition > 0) {
          this.$emit('onScrollDown');
        }
      }
      this.lastScrollPosition = currentPosition;
    },
    getScrollPosition(): number {
      const element = this.$refs.scrollElement as HTMLDivElement | undefined;
      return element ? element.scrollTop : 0;
    }
  }
});
</script>

<style scoped lang="scss">
.scrollable {
  overflow: scroll;
  height: 100%;

  &.scrolling {
    // disable momentum effect during auto scroll to prevent flickering
    -webkit-overflow-scrolling: auto;
  }
}

.ios {
  .scrollable {
    padding-top: var(--offset-top) !important;
    padding-bottom: var(--offset-bottom) !important;
  }
}

.md {
  .scrollable {
    padding-top: var(--offset-top) !important;
    padding-bottom: var(--offset-bottom)  !important;
  }
}
</style>
