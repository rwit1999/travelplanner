import React from 'react';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export const ImageGallery = ({ images }: { images: string[] }) => {
    const randomImages = ['', '']; // Add URLs to default images if needed

    shuffleArray(randomImages);
    const getRandomImage = (index: number) => {
        if (images && images[index]) {
            return images[index];
        } else {
            const randomIndex = index % randomImages.length;
            return randomImages[randomIndex];
        }
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        adaptiveHeight: true,
    };

    return (
        <div className=" bg-gradient-to-r  from-blue-100 to-blue-300 flex justify-center">
            <div className="w-full max-w-4xl ">
                <Slider {...settings} >
                    {images.map((_, index) => (
                        <div key={index}>
                            <div className="relative w-full h-80 md:h-96 lg:h-[500px]">
                                <Image
                                    src={getRandomImage(index)}
                                    alt={`image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg shadow-xl transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
