import ProductCard from './productCard'
import imagePlaceholder from '../../public/Render-1.png'

export default function Header() {

    const products = [
        {
             productId: 1,
             images : [imagePlaceholder],
             title : 'title',
             subTitle : 'subtitle',
             price : '$39.99',
             desciption : 'description',
        },
        {
            productId: 1,
            images : [imagePlaceholder],
            title : 'title',
            subTitle : 'subtitle',
            price : '$39.99',
            desciption : 'description',
       },
       {
            productId: 1,
            images : [imagePlaceholder],
            title : 'title',
            subTitle : 'subtitle',
            price : '$39.99',
            desciption : 'description',
        },
        {
            productId: 1,
            images : [imagePlaceholder],
            title : 'title',
            subTitle : 'subtitle',
            price : '$39.99',
            desciption : 'description',
       },
       {
            productId: 1,
            images : [imagePlaceholder],
            title : 'title',
            subTitle : 'subtitle',
            price : '$39.99',
            desciption : 'description',
       },
       {
            productId: 1,
            images : [imagePlaceholder],
            title : 'title',
            subTitle : 'subtitle',
            price : '$39.99',
            desciption : 'description',
       },
       {
            productId: 1,
            images : [imagePlaceholder],
            title : 'title',
            subTitle : 'subtitle',
            price : '$39.99',
            desciption : 'description',
       },
    ]

    return (
      <div className="flex flex-col items-center max-w-[1500px]">
        <div className="flex items-center justify-between fixed top-0 h-[5vh] w-full max-w-[1500px] bg-white">
            <div className="w-[10vw] ml-[1vw] font-serif">
                LOGO
            </div>
            <div className="flex gap-[1vw] mr-[1vw] font-serif">
                <div>
                    About
                </div>
                <div>
                    Contact
                </div>
                <div>
                    Cart
                </div>
            </div>
        </div>
        <div className="flex flex-col items-center mt-[10vh] font-serif">
            <p className="text-center text-3xl sm:text-7xl">Acrylic Art Collection</p>
            <div className="flex items-center gap-5 mt-[5vh]">
                <div className="w-[40vw] h-[3px] bg-black"></div>
                <div className=""><p className="text-3xl">▲</p></div>
                <div className="w-[40vw] h-[3px] bg-black"></div>
            </div>
        </div>
        <div className="flex-col items-center gap-[5vw] w-full mt-[5vh]">
            {products.map((product, index) => {
                if(index%2===0) {
                    const productsInRow = [product, products[index + 1]]
                    return (
                        <div key={index} className="flex justify-evenly mb-[5vw]">
                            <ProductCard product={product}/>
                            {productsInRow[1] ? (
                            <ProductCard product={products[index+1]} key={index}/>
                            ) : (<div className="w-[35vw]"></div>)}
                        </div>
                    )
                }
            })}
        </div>
      </div>
    )
  }
  