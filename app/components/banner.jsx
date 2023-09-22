
export default function Banner({setEditor, editor, setBanner, banner}) {

    const openEditor = () => {
      setEditor(!editor);
      setBanner(!banner);
    };

    return (
      <div className="flex justify-between items-center h-[500px] w-full border-2 border-red-400 mt-5">
        <div className="flex items-center justify-center h-full w-[50%] border-2 border-red-400">
            <p>Start Customizing your Acrylic Art today!</p>
        </div>
        <div className="flex flex-col items-center justify-evenly h-full w-[50%] border-2 border-red-400">
            <button
             className="border-2 bg-blue-400 rounded-full px-10 py-2"
             onClick={openEditor}
            >Get Started</button>
        </div>
      </div>
    )
  }
  