"use client"
import React, { useState, useRef, useEffect } from "react";
import UndoIcon from '../../public/undo.png';
import RedoIcon from '../../public/redo.png';
import SendBackIcon from '../../public/send-back.png';
import SendFrontIcon from '../../public/send-front.png';
import TrashIcon from '../../public/trash.svg';
import NextImage from 'next/image';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';

export default function Editor({setEditor, setPreview, setImageState}) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedAction, setSelectedAction] = useState(null); // 'move', 'rotate', 'resize'
  const [initialRotation, setInitialRotation] = useState(0);
  const [initialScale, setInitialScale] = useState(1);
  const [imageIdCounter, setImageIdCounter] = useState(0);  // Add this to the state
  const [savedURL, setSavedURL] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [prevImagesState, setPrevImagesState] = useState(null);
  const [triggerDraw, setTriggerDraw] = useState(false);
  const [savedImage, setSavedImage] = useState(null);
  const selectedImage = images.find(img => img.id === selectedImageId);
  


  
  useEffect(() => {
    if (selectedImageId === null) {
      drawImages();
    }
  }, [selectedImageId]);

  useEffect(() => {
    if (triggerDraw) {
      drawImages();
      setTriggerDraw(false); // reset the trigger
    }
  }, [images]);

  useEffect(() => {
    undoStack.forEach((image) => {
       console.log(image)
    })
  }, [undoStack]);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      const imgId = imageIdCounter;
      setImageIdCounter(prevId => prevId + 1);
    
      img.onload = () => {
        let width = img.width;
        let height = img.height;
    
        if (file.type === 'image/svg+xml' && (width === 0 || height === 0 || width === 300 && height === 150)) {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(e.target.result, 'image/svg+xml');
          const svgElement = svgDoc.documentElement;
          width = parseFloat(svgElement.getAttribute('width') || svgElement.viewBox.baseVal.width);
          height = parseFloat(svgElement.getAttribute('height') || svgElement.viewBox.baseVal.height);
        }
    
        setImages([...images, {
          img, 
          x: 0, 
          y: 0, 
          rotation: 0, 
          scale: 1, 
          selected: false,
          zIndex: images.length,  
          id: imgId,
          name: file.name,  // Save the file name
          width: width,    // add these lines
          height: height   // add these lines
        }]);
        drawImages();
      };
      img.src = e.target.result;
    };

  if(file){
    reader.readAsDataURL(file);
  }

  }

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
        -imageObj.width * 0.5,   // Modify here
        -imageObj.height * 0.5, // and here
        imageObj.width,         // and here
        imageObj.height         // and here
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

  const getScaleFactor = () => {
    const canvas = canvasRef.current;
    return canvas.clientWidth / canvas.width;
  }

  const handleMouseDown = (event) => {
    const scaleFactor = getScaleFactor();
    setPrevImagesState(images.map(image => ({ ...image })));

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const mouseX = (event.clientX - canvasBounds.left) / scaleFactor;
    const mouseY = (event.clientY - canvasBounds.top) / scaleFactor;
  
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

        setDragOffset({
          x: (mouseX - clickedImage.x) * scaleFactor,
          y: (mouseY - clickedImage.y) * scaleFactor
        });

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

  const scaleFactor = getScaleFactor();

  const canvasBounds = canvasRef.current.getBoundingClientRect();
  const mouseX = (event.clientX - canvasBounds.left) / scaleFactor;
  const mouseY = (event.clientY - canvasBounds.top) / scaleFactor;

  const newImages = [...images];
  const clickedImageIndex = newImages.findIndex(img => img.id === selectedImageId);
  const clickedImage = newImages[clickedImageIndex];
  const centerX = clickedImage.x + clickedImage.img.width * 0.5 * clickedImage.scale;
  const centerY = clickedImage.y + clickedImage.img.height * 0.5 * clickedImage.scale;

  if (selectedAction === 'move') {
    const x = (mouseX - dragOffset.x / scaleFactor);
    const y = (mouseY - dragOffset.y / scaleFactor);
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
    if (!isEqual(prevImagesState, undoStack[undoStack.length - 1]) && !isEqual(prevImagesState, images) && prevImagesState) {
      setUndoStack([...undoStack, prevImagesState]);
      setRedoStack([]);
    }

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

    setPrevImagesState(images.map(image => ({ ...image })));


    if (!isEqual(prevImagesState, undoStack[undoStack.length - 1]) && !isEqual(prevImagesState, images) && prevImagesState) {
      setUndoStack([...undoStack, prevImagesState]);
      setRedoStack([]);
    }

    setImages(newImages);
    setTriggerDraw(true);
};

const getImage = () => {
  setSelectedImageId(null);
  const canvas = canvasRef.current;
  const dataURL = canvas.toDataURL();

  // Extract only the Base64 part
  const base64Image = dataURL.split(',')[1];
  return base64Image;
};



const handleUndo = () => {
  console.log(undoStack.length);
  if (undoStack.length === 0) return;
  const prevState = undoStack.pop();
  console.log(undoStack.length);
  setRedoStack([...redoStack, images]);

  setImages(prevState);
  setTriggerDraw(true);
};

const handleRedo = () => {
  if (redoStack.length === 0) return;

  const nextState = redoStack.pop();
  setUndoStack([...undoStack, images]);
  setImages(nextState);
  drawImages();
};


const deleteImage = () => {
  if (selectedImageId === null) return;

  // Store current state for undo functionality
  setUndoStack([...undoStack, images]);
  setRedoStack([]);  // Clear redo stack since we've made a new change

  const newImages = images.filter(img => img.id !== selectedImageId);
  setImages(newImages);
  
  setSelectedImageId(null);  // Deselect the image
  setTriggerDraw(true);  // Request a redraw
};

const handleContinue = () => {
  const base64 = getImage();
  setImageState(base64);
  setEditor(false);
  setPreview(true);
}




return (
  <div className="flex">
    
    <div className="flex flex-col items-center">
      <div className="ml-5 outline">
        <canvas
          ref={canvasRef}
          width={3540}
          height={3186}
          style={{ 
            backgroundColor: 'white',
            width: '944px',          // CSS scaled-down width
            height: '849.6px'        // CSS scaled-down height
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <p className="text-gray-600">(3540x3186)</p>
    </div>

    <div className="flex flex-col justify-between bg-gray-800 w-[15vw] h-[849.6px] outline">

      {/* Images section */}
      <div className="flex flex-col h-full">
      <div className="flex flex-col p-2 overflow-y-auto">
        <label className="cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 px-2 rounded text-center">
            <p className="text-blue-950 font-bold">Add Image</p>
            <input 
                type="file"
                className="hidden"
                onChange={handleImageUpload}
            />
        </label>
        <div className="flex flex-col items-start justify-start h-[100px] overflow-y-auto border-l border-r m-2 p-2">
        {images.length ? (images.map(imageObj => (
          <div 
            key={imageObj.id}
            className={`text-white cursor-pointer w-full ${selectedImageId === imageObj.id ? 'font-bold' : ''}`}
            onClick={() => {
              setSelectedImageId(imageObj.id);
              drawImages(imageObj.id);
            }}
          >
            <p className="text-xs">{imageObj.name}</p>
            <div className='border w-full mt-2 mb-2'></div>
          </div>
        ))) : (<p className="ml-[33%] text-white">No Images</p>)}
        </div>
      </div>
      <div className="mt-4 w-full max-h-[20%] bg-black flex justify-center items-center">
        {selectedImage ? (
            <NextImage src={selectedImage.img.src} height={100} width={100} />        
        ) : (<p className="text-center text-white">No Image Selected</p>)}
      </div>


      
        <div className="mt-4 flex justify-center h-[4%]">
          <button 
            className="cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 rounded text-center px-2 mr-2" 
            onClick={() => changeZIndex(selectedImageId, 1)}>
              <NextImage
                src={SendFrontIcon}
                height={20}
                width={20}
              />
          </button>
          <button 
            className="cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 rounded text-center px-2 mr-2" 
            onClick={() => changeZIndex(selectedImageId, -1)}>
              <NextImage
                src={SendBackIcon}
                height={20}
                width={20}
              />
          </button>
          <button 
            className="cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 rounded text-center px-2 mr-2" 
            onClick={handleUndo}>
              <NextImage
                src={UndoIcon}
                height={20}
                width={20}
              />
          </button>
          <button 
            className="cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 rounded text-center px-2 mr-2" 
            onClick={handleRedo}>
              <NextImage
                src={RedoIcon}
                height={20}
                width={20}
              />
          </button>
          <button 
            className="cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 rounded text-center px-2 mr-2" 
            onClick={deleteImage}>
              <NextImage
                src={TrashIcon}
                height={20}
                width={20}
              />
          </button>
        </div>
      
      </div>
      <div className="flex justify-center">
      <button className="text-blue-950 font-bold cursor-pointer bg-white hover:border-2 hover:border-blue-400 text-blue-950 p-2 rounded text-center mb-4" onClick={handleContinue}>
        <p>Continue</p>
      </button>
      </div>
    </div>
  </div>
);

}