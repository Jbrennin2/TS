"use client"
import React, { useState, useRef } from "react";

export default function Editor () {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImages([...images, { img, x: 0, y: 0, rotation:0, scale:1 }]);
        drawImages();
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const drawImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    images.forEach(imageObj => {
      ctx.save();
      const centerX = imageObj.x + imageObj.img.width * 0.5;
      const centerY = imageObj.y + imageObj.img.height * 0.5;
      ctx.translate(centerX, centerY);
      ctx.rotate(imageObj.rotation);
      ctx.scale(imageObj.scale, imageObj.scale);
      ctx.drawImage(
        imageObj.img,
        -imageObj.img.width * 0.5,
        -imageObj.img.height * 0.5
      );
      ctx.restore();
    });
  };
  

  const handleMouseDown = (event) => {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - canvasBounds.left;
    const mouseY = event.clientY - canvasBounds.top;

    const clickedImageIndex = images.findIndex(imageObj => {
      return (
        mouseX > imageObj.x &&
        mouseX < imageObj.x + imageObj.img.width &&
        mouseY > imageObj.y &&
        mouseY < imageObj.y + imageObj.img.height
      );
    });

    if (clickedImageIndex !== -1) {
      const clickedImage = images[clickedImageIndex];
      setDragOffset({
        x: mouseX - clickedImage.x,
        y: mouseY - clickedImage.y
      });
      setSelectedImageIndex(clickedImageIndex);
      setIsDragging(true);
    }
};


const handleMouseMove = (event) => {
  if (!isDragging || selectedImageIndex === null) return;

  const canvasBounds = canvasRef.current.getBoundingClientRect();
  const x = event.clientX - canvasBounds.left - dragOffset.x;
  const y = event.clientY - canvasBounds.top - dragOffset.y;

  const newImages = [...images];
  newImages[selectedImageIndex].x = x;
  newImages[selectedImageIndex].y = y;
  setImages(newImages);

  drawImages();
};


  const handleMouseUp = () => {
    setIsDragging(false);
    //setSelectedImageIndex(null);
  };

  const handleRotate = (delta) => {
    if (selectedImageIndex === null) return;
    const newImages = [...images];
    newImages[selectedImageIndex].rotation += delta;
    setImages(newImages);
    drawImages();
  };
  
  const handleScale = (factor) => {
    if (selectedImageIndex === null) return;
    const newImages = [...images];
    newImages[selectedImageIndex].scale *= factor;
    setImages(newImages);
    drawImages();
  };

  return (
    <div className="flex bg-red-400">
      <div className="flex flex-col items-center justify-center">
        <input 
          className="w-[75%]"
          type="file" onChange={handleImageUpload} />
        <button
          className="h-[10%] border"
          onClick={() => handleRotate(-0.1)}>Rotate Left</button>
        <button 
          className="h-[10%] border"
          onClick={() => handleRotate(0.1)}>Rotate Right</button>
        <button
          className="h-[10%] border"
          onClick={() => handleScale(1.1)}>Zoom In</button>
        <button
          className="h-[10%] border"
          onClick={() => handleScale(0.9)}>Zoom Out</button>
      </div>
      <canvas
        ref={canvasRef}
        width={1180}
        height={1062}
        style={{ backgroundColor: 'white' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};
