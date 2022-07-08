<template>
  <div ref="scrollElement" class="scrollable">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScrollableContent',
  data() {
    return {
      lastScrollPosition: -1
    }
  },
  methods: {
    addScrollHandler() {
      let element = this.$refs.scrollElement as HTMLDivElement;
      element.addEventListener("scroll", () => {
        this.manualScrollHandler()
      });
    },
    manualScrollHandler() {
      let currentPosition = this.getScrollPosition();
      if (this.lastScrollPosition > currentPosition) {
        this.$emit('onScrollUp');
      } else {
        // autoscroll is always +1, don't emit events on that
        let diff = currentPosition - this.lastScrollPosition;
        if (diff > 1) {
          this.$emit('onScrollDown');
        }
      }
      this.lastScrollPosition = currentPosition;
    },
    getScrollPosition(): number {
      let element = this.$refs.scrollElement as HTMLDivElement;
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

<style lang="scss">
.scrollable {
  overflow: scroll;
  height: 100%;

  &.scrolling  {
    // disable momentum effect during auto scroll to prevent flickering
    -webkit-overflow-scrolling: auto;
  }
}

.ios {
  .scrollable {
    padding-top: 44px !important;
    padding-bottom: 44px !important;
  }
}

.md {
  .scrollable {
    padding-top: 56px !important;
    padding-bottom: 56px !important;
  }
}
</style>
