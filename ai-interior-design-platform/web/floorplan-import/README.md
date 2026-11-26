# PDF 户型页转图

`openFloorplanPdf(file, { signal })` 在浏览器打开 PDF，返回页数、`renderPage(pageNumber)` 和 `close()`。页码从 1 开始。每次转图保留页面比例与旋转，生成白底、长边约 2048 像素的 JPEG。切换页码会取消上一页的转换，离开页面选择器时调用 `close()` 释放文档和解析 Worker。户型识别只接收选中页生成的 JPEG。

`vendor/pdfjs-6.5.438/` 来自官方 npm 包 `pdfjs-dist@6.5.438`，包含主模块、解析 Worker、CMap、标准字体、ICC，以及 JPEG 2000、JBIG2 和颜色管理所需的解码资源及许可证。更新时应从同一版本的 npm 包替换主模块、Worker 和资源目录。 [Mozilla PDF.js v6.5.438](https://github.com/mozilla/pdf.js/releases/tag/v6.5.438)
