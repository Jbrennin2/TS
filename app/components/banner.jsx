import { useState, useEffect } from 'react';

export default function Banner({setEditor, editor, setBanner, banner}) {
    const [scrollY, setScrollY] = useState(0);
    const [moveUp, setMoveUp] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getTransform = () => {
      const scale = Math.max(0.5, 1 - scrollY * 0.001); // This will reduce the scale as you scroll. You can adjust the value '0.001' to make the transformation faster or slower.
      return `scale(${scale})`;
  };

  useEffect(() => {
    scrollY > 200 ? setMoveUp(true) : setMoveUp(false);
  }, [scrollY]);
    
    return (
      <div className="flex flex-col items-center">
          <div className={`flex flex-col h-full w-full mt-[20vw] ${scrollY > 200 ? " opacity-0 transition-opacity duration-200" : "transition-opacity duration-1000"}`} style={{ transform: getTransform(), top: 0, zIndex: 10 }}>
            <div className="flex items-center justify-center w-[100%] sm:w[50%] mb-10">
                <p className="text-5xl sm:text-7xl text-center px-5">Create Custom Acrylic Plaques</p>
            </div>

              <div className="flex items-between justify-evenly w-full">

                <div className="flex rounded-lg shadow-lg shadow-black h-[50vh] items-center justify-center w-full bg-white w-[40%]">
                  <button className="bg-blue-300 text-3xl font-bold p-5 rounded-lg shadow-2xl">
                  <a href="/editor">Design Studio</a>
                  </button>                 
                </div>

                <div className="flex rounded-lg shadow-lg shadow-black items-center justify-center h-[50vh] w-full bg-white w-[40%]">
                  <button className="bg-blue-300 text-3xl font-bold p-5 rounded-lg shadow-2xl">
                  <a href="/editor">Design Studio</a>
                  </button>                 
                </div>
            </div>
          </div>
          <div className={`h-[40vw] mt-[10vw] rounded-lg shadow-lg bg-white transition-all duration-500 ${moveUp ? 'w-[80vw] -translate-y-96' : 'w-[40vw]'}`}></div>
      </div>
    )
  }
  