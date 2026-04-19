<template>
  <div class="pdf-viewer" ref="container" :style="viewerStyle">
    <div class="pdf-inner" ref="inner" :style="innerStyle"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed, nextTick, watch } from 'vue';
import { getDocument, type PDFDocumentProxy, GlobalWorkerOptions } from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker';

GlobalWorkerOptions.workerPort = new PdfjsWorker();

export default defineComponent({
  name: 'PdfViewer',
  props: { src: { type: String, required: true } },
  emits: ['fullscreen'],
  setup(props, { emit }) {
    const container = ref<HTMLDivElement | null>(null);
    const inner    = ref<HTMLDivElement | null>(null);
    const zoom     = ref(1);
    const panX     = ref(0);
    const naturalHeight = ref(0);

    const viewerStyle = computed(() => ({
      height: naturalHeight.value > 0 ? `${naturalHeight.value * zoom.value}px` : 'auto',
    }));
    const innerStyle = computed(() => ({
      transform: `translateX(${panX.value}px) scale(${zoom.value})`,
      transformOrigin: 'top left',
    }));

    let prevFs = false;
    watch(zoom, z => {
      const fs = z > 1;
      if (fs !== prevFs) { prevFs = fs; emit('fullscreen', fs); }
    });

    // --- Rendering ---

    let currentPdf: PDFDocumentProxy | null = null;
    let renderGen = 0;

    const renderPage = async (pdf: PDFDocumentProxy, num: number, cw: number, dpr: number) => {
      const page = await pdf.getPage(num);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: (cw || base.width) / base.width * dpr * 2 });
      const canvas = document.createElement('canvas');
      canvas.width  = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.cssText = 'display:block;width:100%;height:auto';
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport, canvas }).promise;
      return canvas;
    };

    const renderPdf = async () => {
      if (!props.src || !inner.value) return;
      const gen = ++renderGen;
      const pdf = await getDocument({ url: props.src }).promise;
      if (gen !== renderGen) { pdf.destroy(); return; }

      const cw  = container.value?.clientWidth ?? 0;
      const dpr = window.devicePixelRatio || 1;
      const canvases = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) => renderPage(pdf, i + 1, cw, dpr))
      );
      if (gen !== renderGen || !inner.value) { pdf.destroy(); return; }

      const frag = document.createDocumentFragment();
      canvases.forEach(c => frag.appendChild(c));
      currentPdf?.destroy();
      currentPdf = pdf;
      inner.value.innerHTML = '';
      inner.value.appendChild(frag);

      await nextTick();
      naturalHeight.value = inner.value?.scrollHeight ?? 0;
    };

    // --- Touch ---

    const clamp = (px: number, z: number) => {
      const w = container.value?.clientWidth ?? 0;
      return Math.max(w * (1 - z), Math.min(0, px));
    };

    // pinch state
    let tz = 1, tpx = 0, td = 0, tmx = 0;
    // single-touch state (sx/sy also serve as tap-start)
    let sx = 0, sy = 0, spx = 0;
    let dir: 'h' | 'v' | null = null;
    let lastTap = 0, isTap = false;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        tz = zoom.value; tpx = panX.value;
        td  = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        tmx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        isTap = false; dir = null;
      } else if (e.touches.length === 1) {
        sx = e.touches[0].clientX; sy = e.touches[0].clientY;
        spx = panX.value; isTap = true; dir = null;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2) {
        isTap = false; e.preventDefault();
        const d   = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const mx  = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const nz  = Math.max(1, tz * d / td);
        zoom.value = nz;
        panX.value = clamp(mx - (tmx - tpx) / tz * nz, nz);
      } else if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) isTap = false;
        if (!dir && (Math.abs(dx) > 4 || Math.abs(dy) > 4))
          dir = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        if (dir === 'h' && zoom.value > 1) { e.preventDefault(); panX.value = clamp(spx + dx, zoom.value); }
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.changedTouches.length !== 1 || e.touches.length || !isTap) return;
      const now = Date.now(), t = e.changedTouches[0];
      if (now - lastTap < 300) {
        if (zoom.value > 1) { zoom.value = 1; panX.value = 0; }
        else { const cx = t.clientX; zoom.value = 2; panX.value = clamp(cx - cx * 2, 2); }
        lastTap = 0;
      } else { lastTap = now; }
    }

    // --- Resize ---

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let lastW = 0;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.contentRect.width);
      if (w === lastW) return;
      lastW = w;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(async () => { zoom.value = 1; panX.value = 0; await renderPdf(); }, 150);
    });

    onMounted(async () => {
      await renderPdf();
      lastW = container.value?.clientWidth ?? 0;
      ro.observe(container.value!);
      const el = container.value!;
      el.addEventListener('touchstart', onTouchStart, { passive: false });
      el.addEventListener('touchmove',  onTouchMove,  { passive: false });
      el.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    });

    onUnmounted(() => {
      ro.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      currentPdf?.destroy();
    });

    watch(() => props.src, async () => { zoom.value = 1; panX.value = 0; await renderPdf(); });

    return { container, inner, viewerStyle, innerStyle };
  }
});
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  background: white;
  overflow-x: hidden;
  overflow-y: visible;
  touch-action: pan-y;
}
.pdf-inner {
  width: 100%;
  will-change: transform;
}
</style>
