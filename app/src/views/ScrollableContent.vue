<template>
  <div ref="scrollElement" class="scrollable">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScrollableContent',
  props: {
    autoScrolling: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lastScrollPosition: -1
    };
  },
  methods: {
    addScrollHandler() {
      const element = this.$refs.scrollElement as HTMLDivElement;
      element.addEventListener("scroll", () => {
        this.manualScrollHandler();
      });
    },
    manualScrollHandler() {
      const currentPosition = this.getScrollPosition();
      if (this.lastScrollPosition > currentPosition) {
        this.$emit('onScrollUp');
      } else if (!this.autoScrolling) {
        // while autoscroll is running, its own forward movement must not be
        // mistaken for a manual scroll-down (the step size varies with the
        // configured scroll speed, so it can no longer be told apart by size)
        const diff = currentPosition - this.lastScrollPosition;
        if (diff > 1 && currentPosition > 0) {
          this.$emit('onScrollDown');
        }
      }
      this.lastScrollPosition = currentPosition;
    },
    getScrollPosition(): number {
      const element = this.$refs.scrollElement as HTMLDivElement;
      if (element) {
        return element.scrollTop;
      } else {
        return 0;
      }
    }
  },
  mounted() {
    this.addScrollHandler();
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
