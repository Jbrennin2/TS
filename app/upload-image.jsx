import { useState } from 'react';
import { useRouter } from 'next/router';
import blob from './vercel-blob.config.js';

export default function UploadImage() {
  const [image, setImage] = useState();
  const router = useRouter();

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    const pathname = `/images/${image.name}`;

    const blobUrl = await blob.put(pathname, image);

    router.push(`/image/${blobUrl}`);
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUploadImage}>Upload Image</button>
    </div>
  );
}
