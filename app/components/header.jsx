export default function Header() {
    return (
      <div className="flex justify-between items-center h-[50px] w-full bg-white sticky shadow-bottom-black">
        <div className="ml-4">
            <p>PicPrints</p>
        </div>
        <div>
            <button className="rounded px-4 py-2 mr-4 shadow shadow-lg bg-gray-300 text-xs sm:text-sm">
                <p>About</p>
            </button>
            <button className="rounded px-4 py-2 mr-4 shadow shadow-lg bg-gray-300 text-xs sm:text-sm">
                <p>Cart</p>
            </button>
        </div>
      </div>
    )
  }
  