
export default function Banner({setEditor, editor, setBanner, banner}) {

    const openEditor = () => {
      setEditor(!editor);
      setBanner(!banner);
    };

    return (
      <div className="flex justify-between items-center h-[500px] w-full mt-5">
        <div className="flex items-center justify-center h-full w-[50%]">
            <p>Start Customizing your Acrylic Art today!</p>
        </div>
        <div className="flex flex-col items-center justify-evenly h-full w-[50%]">
        <nav>
          <a href="/editor">Editor</a>
        </nav>
        </div>
      </div>
    )
  }
  