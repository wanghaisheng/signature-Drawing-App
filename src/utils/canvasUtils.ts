// src/utils/canvasUtils.ts
export const setCanvasSizeAndBackground = (
  canvas: HTMLCanvasElement | null,
  ctx: CanvasRenderingContext2D | null,
  transparentBackground: boolean
) => {
  if (!canvas || !ctx) return;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  if (!transparentBackground) {
    ctx.fillStyle = "#FFFFFF"; // رنگ پس‌زمینه
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};
