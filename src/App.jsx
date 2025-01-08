import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import html2canvas from "html2canvas";
import "./App.css"; // Add any custom styles here

const App = () => {
  const [logo, setLogo] = useState(null);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ width: 100, height: 100 }); // Default size for logo
  const dragItem = useRef();
  const dragOffset = useRef();
  const tshirtRef = useRef();

  // Handle logo drop
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setLogo(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  // Handle drag start
  const handleDragStart = (e) => {
    dragItem.current = e.target;
    dragOffset.current = {
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    };
  };

  const handleDrag = (e) => {
    if (!dragItem.current) return;

    const tshirtRect = tshirtRef.current.getBoundingClientRect();
    const logoWidth = size.width;
    const logoHeight = size.height;

    let x = e.clientX - dragOffset.current.x;
    let y = e.clientY - dragOffset.current.y;

    // Ensure logo stays within boundaries
    x = Math.max(tshirtRect.left, Math.min(x, tshirtRect.right - logoWidth));
    y = Math.max(tshirtRect.top, Math.min(y, tshirtRect.bottom - logoHeight));

    setPosition({ x: x - tshirtRect.left, y: y - tshirtRect.top });
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  const handleResize = (e) => {
    const aspectRatio = size.width / size.height;
    const newWidth = Math.max(50, size.width + e.deltaY * -0.1);
    const newHeight = newWidth / aspectRatio;

    setSize({ width: newWidth, height: newHeight });
  };

  const handleDownload = () => {
    html2canvas(tshirtRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "tshirt_design.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="flex flex-col items-center mr-4">
        <h1 className="text-xl font-bold mb-6 text-center">
          Drag and drop your logo here & scroll up & down to adjust the logo
          to resize
        </h1>
        <div
          ref={tshirtRef}
          className="relative border w-80 h-96 bg-white shadow-lg flex items-center justify-center"
          onWheel={handleResize}
        >
          {/* T-Shirt Image */}
          <img
            src="/tshirt.png" // Replace with your default t-shirt image path
            alt="T-Shirt"
            className="w-full h-full object-contain"
          />
          {/* Logo Image */}
          {logo && (
            <img
              src={logo}
              alt="Logo"
              style={{
                position: "absolute",
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: `${size.width}px`,
                height: `${size.height}px`,
                cursor: "move",
              }}
              draggable
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              className="shadow-md"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div
          {...getRootProps()}
          className="p-4 border-2 border-dashed border-gray-400 bg-white cursor-pointer mb-4"
        >
          <input {...getInputProps()} />
          <p>Drag & Drop your logo here, or click to upload</p>
        </div>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
        >
         Submit And Download Design
        </button>
      </div>
    </div>
  );
};

export default App;
