import { useState } from 'react';
import cleanSvgString from './cleanSvgString';

const useImageHandler = (defaultValues, onImageChange) => {
  const { defaultImageId, defaultImageUrl, defaultImageAlt } = defaultValues;
  const [imageData, setImageData] = useState({
    imageId: defaultImageId,
    imageUrl: defaultImageUrl,
    imageAlt: defaultImageAlt,
    svgCode: ''
  });

  const onSelectImage = async (media) => {
    const newImageData = {
      imageId: media.id,
      imageUrl: media.url,
      imageAlt: media.alt,
      svgCode: ''
    };

    if (media.mime === 'image/svg+xml') {
      try {
        const response = await fetch(media.url);
        const svgString = await response.text();
        newImageData.svgCode = cleanSvgString(svgString);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    }

    setImageData(newImageData);
    onImageChange(newImageData);
  };

  const onRemoveImage = () => {
    const newImageData = { imageId: null, imageUrl: '', imageAlt: '', svgCode: '' };
    setImageData(newImageData);
    onImageChange(newImageData);
  };

  return { imageData, onSelectImage, onRemoveImage };
};

export default useImageHandler;
