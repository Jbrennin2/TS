"use client"
import React, { useState, useRef } from "react";

export default function Editor() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedAction, setSelectedAction] = useState(null); // 'move', 'rotate', 'resize'
  const [initialRotation, setInitialRotation] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [imageIdCounter, setImageIdCounter] = useState(0);  // Add this to the state


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      const imgId = imageIdCounter;
      setImageIdCounter(prevId => prevId + 1);

      img.onload = () => {
        setImages([...images, {
          img, 
          x: 0, 
          y: 0, 
          rotation: 0, 
          scale: 1, 
          selected: false,
          zIndex: images.length,  // new images will be on top by default
          id: imgId,
        }]);
        drawImages();
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const drawImages = (currentlySelectedImageId = selectedImageId) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sortedImages = [...images].sort((a, b) => a.zIndex - b.zIndex);

  
    sortedImages.forEach((imageObj, index) => {
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
      
      if (imageObj.id === currentlySelectedImageId) {
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
          -imageObj.img.height * 0.5 + 10,
          10, 0, 2 * Math.PI
        );
        ctx.fillStyle = 'red';
        ctx.fill();

        // Draw bottom-right resize handle
        ctx.beginPath();
        ctx.arc(
          imageObj.img.width * 0.5 - 10,
          imageObj.img.height * 0.5 - 10,
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
  
    const clickedImage = images.find(imageObj => {
      const dx = mouseX - (imageObj.x + imageObj.img.width * 0.5 * imageObj.scale);
      const dy = mouseY - (imageObj.y + imageObj.img.height * 0.5 * imageObj.scale);
  
      const unrotatedX = dx * Math.cos(-imageObj.rotation) - dy * Math.sin(-imageObj.rotation);
      const unrotatedY = dx * Math.sin(-imageObj.rotation) + dy * Math.cos(-imageObj.rotation);
        
      return (
        unrotatedX > -imageObj.img.width * 0.5 * imageObj.scale &&
        unrotatedX < imageObj.img.width * 0.5 * imageObj.scale &&
        unrotatedY > -imageObj.img.height * 0.5 * imageObj.scale &&
        unrotatedY < imageObj.img.height * 0.5 * imageObj.scale
      );
    });

    setSelectedImageId(clickedImage? clickedImage.id : null);


    if (clickedImage) {

        const centerX = clickedImage.x + clickedImage.img.width * 0.5 * clickedImage.scale;
        const centerY = clickedImage.y + clickedImage.img.height * 0.5 * clickedImage.scale;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        // Calculate unrotated positions for the mouse
        const unrotatedX = dx * Math.cos(-clickedImage.rotation) - dy * Math.sin(-clickedImage.rotation);
        const unrotatedY = dx * Math.sin(-clickedImage.rotation) + dy * Math.cos(-clickedImage.rotation);

        // The scaling handle's position in unrotated coordinates, scaled appropriately
        const scalingHandleX = clickedImage.img.width * 0.5 * clickedImage.scale - 10 * clickedImage.scale;
        const scalingHandleY = clickedImage.img.height * 0.5 * clickedImage.scale - 10 * clickedImage.scale;

        const dxScaleHandle = unrotatedX - scalingHandleX;
        const dyScaleHandle = unrotatedY - scalingHandleY;

        const scalingHandleDist = Math.sqrt(dxScaleHandle**2 + dyScaleHandle**2);


        setDragOffset({ x: mouseX - clickedImage.x, y: mouseY - clickedImage.y });

        setSelectedImageId(clickedImage.id);
        setIsDragging(true);

        // The rotation handle's position in unrotated coordinates, scaled appropriately
        const rotationHandleX = 0;
        const rotationHandleY = -clickedImage.img.height * 0.5 * clickedImage.scale + 10 * clickedImage.scale; 

        // Distance between the unrotated mouse position and the rotation handle
        const dxHandle = unrotatedX - rotationHandleX;
        const dyHandle = unrotatedY - rotationHandleY;

        const rotationHandleDist = Math.sqrt(dxHandle**2 + dyHandle**2);
       
        const bottomRightHandleDist = Math.sqrt(
            (unrotatedX - clickedImage.img.width * 0.5 * clickedImage.scale + 10)**2 + 
            (unrotatedY - clickedImage.img.height * 0.5 * clickedImage.scale + 10)**2
        );


        if (rotationHandleDist <= 10 * clickedImage.scale) {
            setSelectedAction('rotate');
            const angle = Math.atan2(dy, dx);
            setInitialRotation(angle - clickedImage.rotation);  // Set the initial rotation
        } else if (scalingHandleDist <= 10 * clickedImage.scale) {
          setSelectedAction('resize');
          setInitialScale(clickedImage.scale); // store the initial scale
        } else {
            setSelectedAction('move');
        }
    }
};



const handleMouseMove = (event) => {
  if (!isDragging || selectedImageId === null) return;

  const canvasBounds = canvasRef.current.getBoundingClientRect();
  const mouseX = event.clientX - canvasBounds.left;
  const mouseY = event.clientY - canvasBounds.top;

  const newImages = [...images];
  const clickedImageIndex = newImages.findIndex(img => img.id === selectedImageId);
  const clickedImage = newImages[clickedImageIndex];
  const centerX = clickedImage.x + clickedImage.img.width * 0.5 * clickedImage.scale;
  const centerY = clickedImage.y + clickedImage.img.height * 0.5 * clickedImage.scale;

  if (selectedAction === 'move') {
    const x = event.clientX - canvasBounds.left - dragOffset.x;
    const y = event.clientY - canvasBounds.top - dragOffset.y;
    newImages[clickedImageIndex].x = x;
    newImages[clickedImageIndex].y = y;
    
  } else if (selectedAction === 'rotate') {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const angle = Math.atan2(dy, dx);
    newImages[clickedImageIndex].rotation = angle - initialRotation;
    
  } else if (selectedAction === 'resize') {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const currentDiagonalDistance = Math.sqrt(dx**2 + dy**2);
    
    const originalDistanceX = clickedImage.img.width * 0.5 * initialScale;
    const originalDistanceY = clickedImage.img.height * 0.5 * initialScale;
    const originalDiagonalDistance = Math.sqrt(originalDistanceX**2 + originalDistanceY**2);
    
    const scale = initialScale * (currentDiagonalDistance / originalDiagonalDistance);
    
    if (scale > 0) { // prevent negative scaling
      newImages[clickedImageIndex].scale = scale;
    }
  }

  setImages(newImages);
  drawImages();
};

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedAction(null);
  };


  const changeZIndex = (id, direction) => {
    const newImages = [...images];
    const index = newImages.findIndex(img => img.id === id);

    if (direction === 1 && newImages[index].zIndex === newImages.length - 1) return; 
    if (direction === -1 && newImages[index].zIndex === 0) return;

    const targetIndex = newImages.findIndex(img => img.zIndex === newImages[index].zIndex + direction);

    // Swap the zIndex values
    newImages[index].zIndex += direction;
    newImages[targetIndex].zIndex -= direction;

    setImages(newImages);
    drawImages();
};


return (
  <div className="flex bg-gray-600 outline">
    <div className="flex flex-col items-center justify-center bg-gray-800 w-[20vw]">

    <label className="cursor-pointer w-[20%] bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-center">
    <p>Upload Image</p>
    <input 
        type="file"
        className="hidden"
        onChange={handleImageUpload}
    />
</label>

      {/* Images section */}
      <div className="grid grid-cols-3 gap-2">
        {images.map(imageObj => (
          <img 
            key={imageObj.id}
            src={imageObj.img.src} 
            className="w-20 h-20 object-cover cursor-pointer border-2 hover:border-blue-500" 
            alt="Thumbnail"
            onClick={() => {
              setSelectedImageId(imageObj.id);
              drawImages(imageObj.id);  // Redraw canvas to update selection visually
            }}
          />
        ))}
      </div>

      {selectedImageId !== null && (
        <div className="mt-4">
          <button onClick={() => changeZIndex(selectedImageId, 1)}>Bring Forward</button>
          <button onClick={() => changeZIndex(selectedImageId, -1)}>Send Backward</button>
        </div>
      )}
    </div>
    
    <canvas
      ref={canvasRef}
      width={944}
      height={849.6}
      style={{ backgroundColor: 'white' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  </div>
);

}