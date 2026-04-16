<template>
  <div class="pdf-viewer" ref="container" :style="viewerStyle">
    <div class="pdf-inner" ref="inner" :style="innerStyle"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed, nextTick, watch } from 'vue';
import { getDocument, type PDFDocumentProxy, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const pdfjsWorker = new Worker(workerUrl, { type: 'module' });
GlobalWorkerOptions.workerPort = pdfjsWorker;

export default defineComponent({
  name: 'PdfViewer',
  props: {
    src: { type: String, required: true }
  },
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    const inner = ref<HTMLDivElement | null>(null);

    const zoom = ref(1);
    const panX = ref(0);
    const naturalHeight = ref(0);

    const viewerStyle = computed(() => ({
      height: naturalHeight.value > 0 ? `${naturalHeight.value * zoom.value}px` : 'auto',
    }));

    const innerStyle = computed(() => ({
      transform: `translateX(${panX.value}px) scale(${zoom.value})`,
      transformOrigin: 'top left',
    }));

    // --- PDF rendering ---

    let currentPdf: PDFDocumentProxy | null = null;

    const renderPdf = async () => {
      if (!props.src || !inner.value) return;
      inner.value.innerHTML = '';

      currentPdf?.destroy();
      currentPdf = null;

      const task = getDocument({ url: props.src });
      const pdf: PDFDocumentProxy = await task.promise;
      currentPdf = pdf;

      const containerWidth = container.value?.clientWidth ?? 0;
      const dpr = window.devicePixelRatio || 1;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const baseViewport = page.getViewport({ scale: 1 });
        const cssScale = (containerWidth || baseViewport.width) / baseViewport.width;
        const viewport = page.getViewport({ scale: cssScale * dpr * 2 });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        inner.value.appendChild(canvas);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      }

      await nextTick();
      naturalHeight.value = inner.value?.scrollHeight ?? 0;
    };

    // --- Touch / pinch handling ---

    let touchStartZoom = 1;
    let touchStartPanX = 0;
    let touchStartDist = 0;
    let touchStartMidX = 0;

    let singleStartX = 0;
    let singleStartY = 0;
    let singleStartPanX = 0;
    let panDirection: 'horizontal' | 'vertical' | null = null;

    function getTouchDist(t: TouchList) {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function clampPanX(px: number, z: number) {
      const w = container.value?.clientWidth ?? 0;
      return Math.max(w * (1 - z), Math.min(0, px));
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        touchStartZoom = zoom.value;
        touchStartPanX = panX.value;
        touchStartDist = getTouchDist(e.touches);
        touchStartMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        panDirection = null;
      } else if (e.touches.length === 1) {
        singleStartX = e.touches[0].clientX;
        singleStartY = e.touches[0].clientY;
        singleStartPanX = panX.value;
        panDirection = null;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDist = getTouchDist(e.touches);
        const currentMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;

        let newZoom = touchStartZoom * (currentDist / touchStartDist);
        newZoom = Math.max(1, newZoom);

        const midInContent = (touchStartMidX - touchStartPanX) / touchStartZoom;
        zoom.value = newZoom;
        panX.value = clampPanX(currentMidX - midInContent * newZoom, newZoom);
      } else if (e.touches.length === 1 && zoom.value > 1) {
        const dx = e.touches[0].clientX - singleStartX;
        const dy = e.touches[0].clientY - singleStartY;

        if (panDirection === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
          panDirection = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
        }

        if (panDirection === 'horizontal') {
          e.preventDefault();
          panX.value = clampPanX(singleStartPanX + dx, zoom.value);
        }
        // vertical: no preventDefault → ion-content scrolls normally
      }
    }

    onMounted(async () => {
      await renderPdf();
      container.value?.addEventListener('touchstart', onTouchStart, { passive: false });
      container.value?.addEventListener('touchmove', onTouchMove, { passive: false });
    });

    onUnmounted(() => {
      container.value?.removeEventListener('touchstart', onTouchStart);
      container.value?.removeEventListener('touchmove', onTouchMove);
      currentPdf?.destroy();
    });

    watch(() => props.src, async () => {
      zoom.value = 1;
      panX.value = 0;
      await renderPdf();
    });

    return { container, inner, viewerStyle, innerStyle };
  }
});
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  background: white;
  overflow-x: hidden; /* clip horizontal overflow from zoom */
  overflow-y: visible; /* let content grow downward so ion-content can scroll it */
  touch-action: pan-y;
}

.pdf-inner {
  width: 100%;
}
</style>
