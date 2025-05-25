import { useState, useRef, useEffect } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [svg, setSvg] = useState(null);
  const [canvasEnabled, setCanvasEnabled] = useState(false);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const svgRef = useRef(null);

  // Resize canvas display to 50% window width while preserving image aspect ratio
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        const naturalWidth = imageRef.current.naturalWidth;
        const naturalHeight = imageRef.current.naturalHeight;
        const scale = (window.innerWidth * 0.5) / naturalWidth;
        canvasRef.current.style.width = `${window.innerWidth * 0.5}px`;
        canvasRef.current.style.height = `${naturalHeight * scale}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [image]);

  // Load SVG and trigger draw
  useEffect(() => {
    if (image && svg) {
      setCanvasEnabled(true);
      const img = new Image();
      img.src = svg;
      img.onload = () => {
        svgRef.current = img;
        drawCanvas();
      };
    }
  }, [image, svg]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;
    const svgImg = svgRef.current;

    if (!img || !svgImg) return;

    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Set full resolution for internal rendering
    canvas.width = originalWidth;
    canvas.height = originalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Calculate SVG size: 45% of image width, preserve aspect ratio
    const svgWidth = originalWidth * 0.45;
    const svgHeight = svgWidth * (svgImg.naturalHeight / svgImg.naturalWidth);

    const x = (originalWidth - svgWidth) / 2;
    const y = (originalHeight - svgHeight) / 2;

    // Draw SVG in full opacity
    ctx.globalAlpha = 1.0;
    ctx.drawImage(svgImg, 0, 0, svgImg.naturalWidth, svgImg.naturalHeight, x, y, svgWidth, svgHeight);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a JPEG image.");
    }
  };

  const handleSvgUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSvg(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an SVG file.");
    }
  };

  const handleExport = () => {
    const link = document.createElement("a");
    link.download = "overlay-image.jpg";
    link.href = canvasRef.current.toDataURL("image/jpeg");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SVG Overlay Creator</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload JPEG Image&nbsp;
          </label>
          <input type="file" accept="image/jpeg" onChange={handleImageUpload} className="w-full" />
          {image && (
            <img ref={imageRef} src={image} alt="Uploaded JPEG" className="hidden" onLoad={drawCanvas} />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload SVG File&nbsp;
          </label>
          <input type="file" accept="image/svg+xml" onChange={handleSvgUpload} className="w-full" />
          {svg && (
            <img ref={svgRef} src={svg} alt="Uploaded SVG" className="hidden" onLoad={drawCanvas} />
          )}
        </div>

        <div className="flex justify-center mt-6">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 bg-white shadow-md"
            style={{
              maxWidth: "50vw",
              height: "auto",
            }}
          ></canvas>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleExport}
            disabled={!canvasEnabled}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              canvasEnabled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-200"
            }`}
          >
            Export as JPEG (Original Size)
          </button>
        </div>
      </div>
    </div>
  );
}