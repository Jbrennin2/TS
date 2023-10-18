

import Image from 'next/image'
import { useState, useEffect } from 'react'
import imagePlaceholder from '../../public/Render-1.png'

export default function Header(data) {
    
    const [product, setProduct] = useState({
        productId: 1,
        images : [imagePlaceholder],
        title : 'loading',
        subTitle : '',
        price : '',
        desciption : '',
    })

    useEffect (() => {
        setProduct(data.product)
    }, [])

    return (
        product ? (
            <div className="flex flex-col bg-gray-100 w-[35vw] h-[50vw]">
                <div className="w-[35vw] flex justify-center mt-[2.5vh]">
                    <div className="w-[20vw]">
                        <Image src={imagePlaceholder} alt='image'></Image>
                    </div>
                </div>
                <div className="w-[35vw] flex justify-center mt-[2.5vh]">
                    <p className="text-bold">{product.title}</p>
                </div>
            </div>
        ) : (
            <div className="flex bg-gray-100 w-[35vw] h-[50vw] items-center justify-center">
                <>LOADING</>
            </div>
        )
        
    )
}