import { useState, useRef, useEffect } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [svg, setSvg] = useState(null);
  const [canvasEnabled, setCanvasEnabled] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const svgRef = useRef(null);

  // Load SVG into image element and trigger draw
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

    // Set canvas size based on image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Calculate SVG size (45% of image width, preserve aspect ratio)
    const svgWidth = canvas.width * 0.45;
    const aspectRatio = svgImg.naturalHeight / svgImg.naturalWidth;
    const svgHeight = svgWidth * aspectRatio;

    // Center coordinates
    const x = (canvas.width - svgWidth) / 2;
    const y = (canvas.height - svgHeight) / 2;

    // Draw white rectangle with 50% opacity
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(x, y, svgWidth, svgHeight);

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
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "overlay-image.jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SVG Overlay Creator</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload JPEG Image
          </label>
          <input type="file" accept="image/jpeg" onChange={handleImageUpload} className="w-full" />
          {image && (
            <img ref={imageRef} src={image} alt="Uploaded JPEG" className="hidden" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload SVG File
          </label>
          <input type="file" accept="image/svg+xml" onChange={handleSvgUpload} className="w-full" />
        </div>

        <div className="flex justify-center mt-6">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 bg-white shadow-md"
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
            Export as JPEG
          </button>
        </div>
      </div>
    </div>
  );
}