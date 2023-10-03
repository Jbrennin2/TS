import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCircleStop
} from "@fortawesome/free-solid-svg-icons";


export default function Banner({setEditor, editor, setBanner, banner}) {


    return (
      <div className="flex justify-center items-center h-[500px] w-full mt-5">
        <div className="flex flex-col items-center justify-evenly h-full">
        <div className="flex items-center justify-center h-full w-[50%]">
            <p className="text-7xl">Create Custom Acrylic Plaques</p>
        </div>
        <nav>
          <button className="border bg-blue-300 text-3xl font-bold p-5 rounded-lg shadow-2xl">
          <a href="/editor">Design Studio</a>
          </button>
        </nav>
        </div>
      </div>
    )
  }
  