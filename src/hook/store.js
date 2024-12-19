// src/hook/store.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCanvasStore = create(
  persist(
    (set) => ({
      tools: [],
      colorPlatte: [],
      cursorStyle: "/tools/brush.svg",
      color: "#000",
      range: "5",
      selectTool: "brush",
      startPoint: null,
      snapShot: null,
      isDrawing: false,
      canvasData: null,
      transparentBackground: true,

      // Actions
      setTools: (tools) => set({ tools }),
      setColorPlatte: (colorPlatte) => set({ colorPlatte }),
      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setColor: (color) => set({ color }),
      setRange: (range) => set({ range }),
      setSelectTool: (selectTool) => set({ selectTool }),
      setStartPoint: (startPoint) => set({ startPoint }),
      setSnapShot: (snapShot) => set({ snapShot }),
      setIsDrawing: (isDrawing) => set({ isDrawing }),
      setCanvasData: (canvasData) => set({ canvasData }),
      setTransparentBackground: (transparentBackground) => set({ transparentBackground }),
    }),
    {
      name: "canvas-storage", // نام ذخیره در localStorage
      partialize: (state) => ({
        tools: state.tools,
        colorPlatte: state.colorPlatte,
        cursorStyle: state.cursorStyle,
        color: state.color,
        range: state.range,
        selectTool: state.selectTool,
        canvasData: state.canvasData,
        transparentBackground: state.transparentBackground,
      }),
    }
  )
);

export default useCanvasStore;
