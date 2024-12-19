import "./App.css";
import { tools as tool, colorPlatte as colorsList } from "./bin/data";
import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { PointEvent, Tool } from "./interfaces/types";
import { useDrawVariables } from "./helpers/useDrawVariables";
import { useDrawShapes } from "./helpers/useDrawShapes";
import Capitalize from "./utils/Capitalize";
import { VscSymbolColor } from "react-icons/vsc";
import UseCanvasStore from "@hook/store";
import { BsGithub } from "react-icons/bs";


function App() {
  const {
    tools,
    colorPlatte,
    cursorStyle,
    color,
    range,
    selectTool,
    setTools,
    setColorPlatte,
    setCursorStyle,
    setColor,
    setRange,
    setSelectTool,
    canvasData,
    setCanvasData,
    transparentBackground,
    setTransparentBackground,
  } = UseCanvasStore();

  const [startPoint, setStartPoint] = useState<PointEvent>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // const [transparentBackground, setTransparentBackground] = useState<boolean>(true);
  // const [selectTool, setSelectTool] = useState<string>("brush");
  const { canvas, ctx, snapShot } = useDrawVariables();
  const { drawCircle, drawLine, drawRectangle, drawEraser, drawTriangle } =
    useDrawShapes(ctx, color, startPoint, range);

  useEffect(() => {
    setTools(tool);
    setColorPlatte(colorsList);
  }, [setTools, setColorPlatte]);

  useEffect(() => {
    if (!canvas) return;
    ctx.current = canvas.current?.getContext("2d");
  }, [canvas, ctx]);

  useLayoutEffect(() => {
    if (canvas.current) {
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;
      if (!transparentBackground && ctx.current) {
        ctx.current.fillStyle = "#FFFFFF";
        ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
      }
    }
  }, [canvas, transparentBackground]);

  const onSelectTool = useCallback(
    (name: string) => {
      setSelectTool(name.toLowerCase());
      setCursorStyle(
        name.toLowerCase() === "brush"
          ? "/tools/brush.svg"
          : name.toLowerCase() === "eraser"
          ? "/eraser.svg"
          : ""
      );
    },
    [setSelectTool, setCursorStyle]
  );

  
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      setIsDrawing(true);
      if (!ctx.current || !canvas.current) return;

      ctx.current.beginPath();
      snapShot.current = ctx.current.getImageData(
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
      const x = e.clientX - canvas.current.getBoundingClientRect().left;
      const y = e.clientY - canvas.current.getBoundingClientRect().top;
      setStartPoint({ x, y });
    },
    [ctx, canvas, snapShot]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault(); // جلوگیری از اسکرول صفحه
      setIsDrawing(true);
      if (!ctx.current || !canvas.current) return;

      ctx.current.beginPath();
      snapShot.current = ctx.current.getImageData(
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
      const touch = e.touches[0];
      const x = touch.clientX - canvas.current.getBoundingClientRect().left;
      const y = touch.clientY - canvas.current.getBoundingClientRect().top;
      setStartPoint({ x, y });
    },
    [ctx, canvas, snapShot]
  );

  const onSelectColor = useCallback(
    (color: string) => {
      setColor(color);
    },
    [setColor]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      if (!isDrawing || !canvas.current || !ctx.current || !snapShot.current)
        return;

      ctx.current.putImageData(snapShot.current, 0, 0);
      const x = e.clientX - canvas.current.getBoundingClientRect().left;
      const y = e.clientY - canvas.current.getBoundingClientRect().top;
      const event = { x, y };

      switch (selectTool) {
        case "brush":
          drawLine(event);
          break;
        case "rectangle":
          drawRectangle(event);
          break;
        case "circle":
          drawCircle(event);
          break;
        case "triangle":
          drawTriangle(event);
          break;
        default:
          drawEraser(event);
      }
    },
    [
      isDrawing,
      canvas,
      ctx,
      snapShot,
      selectTool,
      drawLine,
      drawRectangle,
      drawCircle,
      drawTriangle,
      drawEraser,
    ]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvas.current || !ctx.current || !snapShot.current)
        return;

      ctx.current.putImageData(snapShot.current, 0, 0);
      const touch = e.touches[0];
      const x = touch.clientX - canvas.current.getBoundingClientRect().left;
      const y = touch.clientY - canvas.current.getBoundingClientRect().top;
      const event = { x, y };

      switch (selectTool) {
        case "brush":
          drawLine(event);
          break;
        case "rectangle":
          drawRectangle(event);
          break;
        case "circle":
          drawCircle(event);
          break;
        case "triangle":
          drawTriangle(event);
          break;
        default:
          drawEraser(event);
      }
    },
    [
      isDrawing,
      canvas,
      ctx,
      snapShot,
      selectTool,
      drawLine,
      drawRectangle,
      drawCircle,
      drawTriangle,
      drawEraser,
    ]
  );

  const onMouseUp = useCallback(() => {
    setIsDrawing(false);
    if (!canvas.current) return;

    const dataUrl = canvas.current.toDataURL("image/png");
    setCanvasData(dataUrl);
    localStorage.setItem("savedCanvasData", dataUrl);
  }, [canvas, setCanvasData]);

  const onTouchEnd = useCallback(() => {
    setIsDrawing(false);
    if (!canvas.current) return;

    const dataUrl = canvas.current.toDataURL("image/png");
    setCanvasData(dataUrl);
    localStorage.setItem("savedCanvasData", dataUrl);
  }, [canvas, setCanvasData]);


  useEffect(() => {
    if (!canvas) return;
    ctx.current = canvas.current?.getContext("2d");

    if (canvasData && ctx.current) {
      const image = new Image();
      image.src = canvasData;
      image.onload = () => ctx.current?.drawImage(image, 0, 0);
    }
  }, [canvas, ctx, canvasData]);

  const onClearCanvas = useCallback(() => {
    if (canvas.current) {
      ctx.current?.clearRect(0, 0, canvas.current.width, canvas.current.height);
      if (!transparentBackground && ctx.current) {
        ctx.current.fillStyle = "#FFFFFF";
        ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
      }
      setCanvasData(null);
      localStorage.removeItem("savedCanvasData");
    }
  }, [canvas, ctx, setCanvasData, transparentBackground]);

  const handleSave = useCallback(() => {
    if (!canvas.current) return;

    const dataUrl = canvas.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.setAttribute("download", `canvas-paint-${Date.now()}.png`);
    link.setAttribute("href", dataUrl);
    link.click();

    setCanvasData(dataUrl);
    localStorage.setItem("savedCanvasData", dataUrl);
  }, [canvas, setCanvasData]);

  useEffect(() => {
    if (!canvas) return;
    ctx.current = canvas.current?.getContext("2d");

    const savedData = localStorage.getItem("savedCanvasData");
    if (savedData && ctx.current) {
      const image = new Image();
      image.src = savedData;
      image.onload = () => ctx.current?.drawImage(image, 0, 0);
    }
  }, [canvas, ctx]);

  // // useEffect برای بارگذاری مجدد داده‌ها از localStorage بعد از تغییر transparentBackground
  // useEffect(() => {
  //   if (!canvas) return;
  //   ctx.current = canvas.current?.getContext("2d");

  //   const savedData = localStorage.getItem("savedCanvasData");
  //   if (savedData && ctx.current) {
  //     const image = new Image();
  //     image.src = savedData;
  //     image.onload = () => ctx.current.drawImage(image, 0, 0);
  //   }
  // }, [transparentBackground, canvas, ctx]); // استفاده از transparentBackground به عنوان dependency

  // useEffect برای بارگذاری مجدد داده‌ها از localStorage بعد از تغییر transparentBackground
  useEffect(() => {
    if (!canvas) return;

    // گرفتن context و اطمینان از اینکه canvas آماده است
    const context = canvas.current?.getContext("2d");
    if (!context) return;

    // بارگذاری داده‌ها از localStorage فقط در صورتی که نیاز باشد
    const savedData = localStorage.getItem("savedCanvasData");
    if (savedData) {
      const image = new Image();
      image.src = savedData;

      // استفاده از onload برای رسم تصویر بعد از بارگذاری کامل
      image.onload = () => {
        // استفاده از requestAnimationFrame برای بهینه‌سازی عملکرد
        requestAnimationFrame(() => {
          // context.clearRect(0, 0, canvas.current.width, canvas.current.height); // پاکسازی canvas
          if (canvas.current) {
            context.clearRect(
              0,
              0,
              canvas.current.width,
              canvas.current.height
            );
          }

          context.drawImage(image, 0, 0); // کشیدن تصویر
        });
      };

      // در صورتی که تصویر بارگذاری نشود، از alert استفاده کنید
      image.onerror = () => {
        console.error("Failed to load image from localStorage");
      };
    }
  }, [transparentBackground, canvas]); // فقط dependencyهای ضروری




  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState<number>(Date.now());

  // Timeout to close the menu if no touch is detected for 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastTouch = Date.now() - lastTouchTime;
      if (timeSinceLastTouch > 20000) {
        setIsMenuOpen(false); // Close the menu after 5 seconds of inactivity
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastTouchTime]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleTouchStart = useCallback(() => {
    setLastTouchTime(Date.now()); // Update the last touch time
  }, []);


    









  // const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // const [isInstallable, setIsInstallable] = useState(false);

  // useEffect(() => {
  //   const handleBeforeInstallPrompt = (e: any) => {
  //     e.preventDefault();
  //     setDeferredPrompt(e);
  //     setIsInstallable(true); // وقتی که اپلیکیشن آماده نصب شد
  //   };

  //   window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  //   return () => {
  //     window.removeEventListener(
  //       "beforeinstallprompt",
  //       handleBeforeInstallPrompt
  //     );
  //   };
  // }, []);

  // const handleInstallClick = () => {
  //   if (deferredPrompt) {
  //     deferredPrompt.prompt(); // دکمه نصب را نشان می‌دهیم
  //     deferredPrompt.userChoice.then((choiceResult: any) => {
  //       console.log(choiceResult.outcome);
  //       setDeferredPrompt(null); // پس از نصب یا لغو، deferredPrompt را ریست می‌کنیم
  //     });
  //   }
  // };


  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          })
          .catch((error) => {
            console.log("Service Worker registration failed:", error);
          });
      });
    }
  }, []);






return (
  <div
    className="h-screen bg-[#F5F5F5] flex items-center select-none flex-col md:flex-row"
    onTouchStart={handleTouchStart} // برای به‌روزرسانی زمان آخرین لمس
  >
    {/* {isInstallable && <button onClick={handleInstallClick}>Install</button>} */}
    {/* منوی کشویی */}
    <div
      className={`toolbar w-full md:w-[20%] py-4 px-5 h-full bg-white transition-transform transform md:transform-none ${
        isMenuOpen ? "transform-none" : "-translate-x-full"
      } md:translate-x-0`} // در حالت دسکتاپ منو همیشه باز است
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        transition: "transform 0.3s ease",
      }}
    >
      <h2 className="text-[20px] font-semibold">Shapes</h2>
      <ul className="list-none mt-6">
        {tools.map((tool: Tool, index: number) => (
          <li
            key={index}
            className="flex gap-4 my-4 group cursor-pointer items-center"
            onClick={() => onSelectTool(tool.name)}
          >
            <i
              dangerouslySetInnerHTML={{ __html: tool.icon }}
              className={`toolIcon ${
                Capitalize(selectTool) === tool.name ? "active" : ""
              }`}
            />
            <span
              className={`text-[18px] sm:text-[20px] text-gray-600 group-hover:text-[#764abc] ${
                Capitalize(selectTool) === tool.name ? "text-[#764abc]" : ""
              }`}
            >
              {tool.name}
            </span>
          </li>
        ))}
      </ul>

      {/* کنترل اندازه قلم */}
      <div className="size mt-4">
        <input
          type="range"
          min="1"
          max="10"
          value={range}
          className="range-slider"
          onChange={(e) => {
            setRange(e.target.value);
            drawLine(range);
          }}
        />
      </div>

      {/* پالت رنگ */}
      <div className="color-plate mt-4">
        <div className="text-center flex items-center gap-5 mb-4">
          <div className="border-[#4A98F7] border-solid border-2 p-1 rounded-[50%] cursor-pointer">
            <p
              className="rounded-[50%] border border-solid w-7 h-7"
              style={{ backgroundColor: color }}
            ></p>
          </div>
        </div>
        <ul className="list-none flex gap-1 flex-wrap">
          {colorPlatte.map((color: any, index: any) => (
            <li
              key={index}
              className="rounded-[50%] border-[#adadad] border border-solid w-5 h-5 cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => onSelectColor(color)}
            />
          ))}
        </ul>
        <div className="flex mt-2 text-[18px] sm:text-[20px]">
          <p className="flex w-fit">
            <VscSymbolColor className="mt-[6px] me-2" /> Custom Color:
          </p>
          <input
            className="lg:ms-2 mt-1 h-6"
            type="color"
            onBlur={(e) => {
              onSelectColor(e.target.value);
              e.target.value = "black";
            }}
          />
        </div>
      </div>

      {/* دکمه‌های کنترل */}
      <div className="mt-5">
        <button
          className="px-4 py-3 rounded-lg bg-gray-200 border-gray-50 border-2 border-solid w-full sm:w-auto"
          onClick={onClearCanvas}
        >
          Clear Canvas
        </button>
        <button
          className="px-4 py-3 mt-2 rounded-lg text-white bg-green-600 border-2 border-solid w-full sm:w-auto"
          onClick={handleSave}
        >
          Save as Image
        </button>
        <div className="mt-4 w-fit">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!transparentBackground}
              onChange={() => setTransparentBackground(!transparentBackground)}
            />
            <span className="ml-2 text-[16px] text-gray-700">
              White Background
            </span>
          </label>
        </div>
      </div>
    </div>

    {/* تگ جدید که می‌خواهید بالای تگ canvas قرار بگیرد */}
    {/* <button className="fixed top-0 left-1/3 justify-center items-center ms-auto bg-blue-500 text-white p-2
        rounded-full">
          تگ جدید بالا
      </button> */}
    {/* تگ جدید که می‌خواهید بالای تگ canvas قرار بگیرد */}
    <button
      className="fixed flex top-0 left-1/3 lg:ms-40 mt-5 lg:mt-2 justify-center items-center ms-auto bg-black text-white p-2 rounded-full"
      onClick={() => {
        window.open("https://github.com/BTF-Kabir-2020/", "_blank");
        window.open(
          "https://github.com/BTF-Kabir-2020/Canvas-Drawing-App",
          "_blank"
        );
        window.open(
          "https://github.com/BTF-Kabir-2020?tab=repositories",
          "_blank"
        );
      }}
    >
      <BsGithub className="me-2" />
      BTF Kabir (Github)
    </button>

    {/* کانواس */}
    <div className="canvas-container mt-20 lg:mt-11 lg:ms-auto md:w-[90%] lg:w-[77.2%] h-[90%] bg-white shadow-lg mx-5 rounded-lg overflow-hidden">
      <canvas
        ref={canvas}
        className={`w-full h-full ${
          cursorStyle === "/eraser.svg" ? "pt-9" : "pt-[2%]"
        }`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        style={{
          cursor: cursorStyle ? `url(${cursorStyle}), auto` : "default",
        }}
      ></canvas>
    </div>

    {/* دکمه منو */}
    <button
      className="menu-toggle-btn md:hidden absolute top-4 left-4 bg-green-600 text-white p-3 rounded-full"
      onClick={toggleMenu}
    >
      {isMenuOpen ? "Close Menu" : "Open Menu"}
    </button>
  </div>
);

}

export default App;
