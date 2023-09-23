"use client"
import React, { useState, useRef } from "react";

export default function Editor() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedAction, setSelectedAction] = useState(null); // 'move', 'rotate', 'resize'
  const [initialRotation, setInitialRotation] = useState(0);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImages([...images, { img, x: 0, y: 0, rotation: 0, scale: 1, selected: false }]);
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
  
    images.forEach((imageObj, index) => {
      const centerX = imageObj.x + imageObj.img.width * 0.5 * imageObj.scale;
      const centerY = imageObj.y + imageObj.img.height * 0.5 * imageObj.scale;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(imageObj.rotation);
      ctx.scale(imageObj.scale, imageObj.scale);
      ctx.drawImage(
        imageObj.img,
        -imageObj.img.width * 0.5,
        -imageObj.img.height * 0.5
      );
      
      if (index === selectedImageIndex) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;

        // Draw selection rectangle
        ctx.strokeRect(
          -imageObj.img.width * 0.5,
          -imageObj.img.height * 0.5,
          imageObj.img.width,
          imageObj.img.height
        );

        // Draw rotation handle
        ctx.beginPath();
        ctx.arc(
          0,
          -imageObj.img.height * 0.5,
          10, 0, 2 * Math.PI
        );
        ctx.fillStyle = 'red';
        ctx.fill();

        // Draw bottom-right resize handle
        ctx.beginPath();
        ctx.arc(
          imageObj.img.width * 0.5,
          imageObj.img.height * 0.5,
          10, 0, 2 * Math.PI
        );
        ctx.fillStyle = 'green';
        ctx.fill();
      }

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
            mouseX < imageObj.x + imageObj.img.width * imageObj.scale &&
            mouseY > imageObj.y &&
            mouseY < imageObj.y + imageObj.img.height * imageObj.scale
        );
    });

    if (clickedImageIndex !== -1) {
        const clickedImage = images[clickedImageIndex];

        const centerX = clickedImage.x + clickedImage.img.width * 0.5 * clickedImage.scale;
        const centerY = clickedImage.y + clickedImage.img.height * 0.5 * clickedImage.scale;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        // Calculate unrotated positions for the mouse
        const unrotatedX = dx * Math.cos(-clickedImage.rotation) - dy * Math.sin(-clickedImage.rotation);
        const unrotatedY = dx * Math.sin(-clickedImage.rotation) + dy * Math.cos(-clickedImage.rotation);

        setDragOffset({ x: mouseX - clickedImage.x, y: mouseY - clickedImage.y });

        setSelectedImageIndex(clickedImageIndex);
        setIsDragging(true);

        const rotationHandleDist = Math.sqrt(unrotatedX**2 + (unrotatedY + clickedImage.img.height * 0.5 * clickedImage.scale)**2);
        const bottomRightHandleDist = Math.sqrt(
            (unrotatedX - clickedImage.img.width * 0.5 * clickedImage.scale)**2 + 
            (unrotatedY - clickedImage.img.height * 0.5 * clickedImage.scale)**2
        );

        if (rotationHandleDist <= 10) {
            setSelectedAction('rotate');
            const angle = Math.atan2(dy, dx);
            setInitialRotation(angle - clickedImage.rotation);  // Set the initial rotation
        } else if (bottomRightHandleDist <= 10) {
            setSelectedAction('resize');
        } else {
            setSelectedAction('move');
        }
    }
};



  const handleMouseMove = (event) => {
    if (!isDragging || selectedImageIndex === null) return;
  
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - canvasBounds.left;
    const mouseY = event.clientY - canvasBounds.top;
    const clickedImage = images[selectedImageIndex];
    const centerX = clickedImage.x + clickedImage.img.width * 0.5 * clickedImage.scale;
    const centerY = clickedImage.y + clickedImage.img.height * 0.5 * clickedImage.scale;
  
    if (selectedAction === 'move') {
      const x = event.clientX - canvasBounds.left - dragOffset.x;
      const y = event.clientY - canvasBounds.top - dragOffset.y;
  
      const newImages = [...images];
      newImages[selectedImageIndex].x = x;
      newImages[selectedImageIndex].y = y;
      setImages(newImages);
    } else if (selectedAction === 'rotate') {
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const angle = Math.atan2(dy, dx);
      const newImages = [...images];
      newImages[selectedImageIndex].rotation = angle - initialRotation;
      setImages(newImages);
    } else if (selectedAction === 'resize') {
      const distanceFromCenter = Math.sqrt((centerX - mouseX)**2 + (centerY - mouseY)**2);
      const originalDistance = clickedImage.img.width * 0.5;
      const scale = distanceFromCenter / originalDistance;
  
      const newImages = [...images];
      newImages[selectedImageIndex].scale = scale;
      setImages(newImages);
    }
  
    drawImages();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedAction(null);
  };

  return (
    <div className="flex bg-red-400">
      <div className="flex flex-col items-center justify-center">
        <input 
          className="w-[75%]"
          type="file" onChange={handleImageUpload} />
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