<template>
  <div class="pdf-viewer" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { getDocument, type PDFDocumentProxy, GlobalWorkerOptions } from 'pdfjs-dist';

const pdfjsWorker = new Worker(
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
  { type: 'module' }
);
GlobalWorkerOptions.workerPort = pdfjsWorker;

export default defineComponent({
  name: 'PdfViewer',
  props: {
    src: { type: String, required: true }
  },
  setup: function (props) {
    const container = ref<HTMLDivElement | null>(null);

    const renderPdf = async () => {
      if (!props.src || !container.value) return;

      // Container zurücksetzen
      container.value.innerHTML = '';

      const task = getDocument({ url: props.src });
      const pdf: PDFDocumentProxy = await task.promise;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const baseViewport = page.getViewport({scale: 1});
        const availableWidth = container.value.clientWidth || baseViewport.width;
        const scale = availableWidth / baseViewport.width;
        const viewport = page.getViewport({scale});

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        container.value.appendChild(canvas);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      }
    };

    onMounted(renderPdf);
    watch(() => props.src, renderPdf);

    return {container};
  }
});
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  background: white;
}
</style>
