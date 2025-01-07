"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveLeftIcon, MoveRightIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SliderProps {
  images: string[];
}

const Slider = ({ images }: SliderProps) => {
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  const changeSlide = (direction: "left" | "right") => {
    if (imageIndex !== null) {
      if (direction === "left") {
        setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
      } else {
        setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
      }
    }
  };

  return (
    <div className="relative w-full">
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-between items-center z-50 p-6">
          <Button
            variant="outline"
            className=" dark:bg-neutral-700"
            onClick={() => changeSlide("left")}
          >
            <MoveLeftIcon className="size-8" />
          </Button>

          <div className="flex items-cetner justify-center">
            <Image
              src={images[imageIndex]}
              alt={`slide ${imageIndex}`}
              width={800}
              height={600}
              className="rounded-lg object-cover"
            />
          </div>

          <Button
            variant="outline"
            className=" dark:bg-neutral-700"
            onClick={() => changeSlide("left")}
          >
            <MoveRightIcon className="size-8" />
          </Button>

          <Button
            variant="muted"
            className="absolute top-4 right-4 cursor-pointer text-neutral-200 hover:text-neutral-400 transition duration-300"
            onClick={() => setImageIndex(null)}
          >
            <XIcon className="!size-5" />
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center mb-6 ">
        <Image
          src={images[0] || "/images/no-image.png"}
          alt="bigger-image"
          width={300}
          height={200}
          className="rounded-lg object-cover cursor-pointer"
          onClick={() => setImageIndex(0)}
        />
      </div>

      {/* Small Images */}
      <div className="flex items-center justify-start gap-2 mt-4 flex-wrap">
        {images.slice(1).map((image, index) => (
          <div key={index}>
            <Image
              src={image || "/images/no-image.png"}
              alt={`small image ${index + 1}`}
              width={100}
              height={100}
              className="object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 w-24 h-24"
              onClick={() => setImageIndex(index + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
