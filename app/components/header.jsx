export default function Header() {
    return (
      <div className="flex justify-between items-center h-[30px] w-full bg-white absolute top-0 shadow-bottom-black">
        <div className="ml-4">
            <p>PicPrints</p>
        </div>
        <div>
            <button className="rounded px-2 py-[2px] mr-4 shadow shadow-lg bg-gray-300 text-[10px] sm:text-[10px]">
                <p>About</p>
            </button>
            <button className="rounded px-2 py-[2px] mr-4 shadow shadow-lg bg-gray-300 text-[10px] sm:text-[10px]">
                <p>Cart</p>
            </button>
        </div>
      </div>
    )
  }
  