import { useEffect, useRef, useState } from 'react';

interface UseImageLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useImageLazyLoad = (
  src: string,
  options: UseImageLazyLoadOptions = {}
) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { threshold = 0.1, rootMargin = '50px' } = options;

  useEffect(() => {
    // Reset states when src changes
    setImageSrc('');
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !imageSrc) {
          setImageSrc(src || '/placeholder.svg');
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [src, imageSrc, threshold, rootMargin]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => {
        setIsError(true);
        // Set placeholder image on error
        setImageSrc('/placeholder.svg');
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // If no source provided, use placeholder
  const finalImageSrc = src ? imageSrc : '/placeholder.svg';

  return {
    imgRef,
    imageSrc: isLoaded || isError ? finalImageSrc : '',
    isLoading: !!imageSrc && !isLoaded && !isError,
    isError,
  };
};