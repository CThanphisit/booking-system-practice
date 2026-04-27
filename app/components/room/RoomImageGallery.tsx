"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { Expand, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  roomName: string;
};

// Placeholder gradient สำหรับกรณีที่ยังไม่มีรูปจริง
const PLACEHOLDER_COLORS = [
  "from-indigo-100 to-indigo-200",
  "from-amber-100 to-amber-200",
  "from-stone-100 to-stone-200",
  "from-rose-100 to-rose-200",
  "from-teal-100 to-teal-200",
];

export default function RoomImageGallery({ images, roomName }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  console.log("images", images);

  const hasImages = images.length > 0;

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  // ─── Layout: 1 รูป ────────────────────────────────────────────────────────
  if (!hasImages || images.length === 1) {
    return (
      <>
        <div
          className="relative w-full h-[420px] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => hasImages && openLightbox(0)}
        >
          {hasImages ? (
            <Image
              src={images[0]}
              alt={`${roomName} - รูปที่ 1`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 75vw"
              priority
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${PLACEHOLDER_COLORS[0]} flex items-center justify-center`}
            >
              <span className="text-stone-400 text-sm">ไม่มีรูปภาพ</span>
            </div>
          )}
          {hasImages && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-stone-800 text-sm font-medium px-4 py-2 rounded-full flex items-center gap-2">
                <Expand className="w-4 h-4" />
                ขยายรูป
              </div>
            </div>
          )}
        </div>

        {hasImages && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={activeIndex}
            slides={images.map((src) => ({ src, alt: roomName }))}
            plugins={[Zoom, Counter]}
          />
        )}
      </>
    );
  }

  // ─── Layout: 2 รูป ────────────────────────────────────────────────────────
  if (images.length === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3 h-[420px]">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={src}
                alt={`${roomName} - รูปที่ ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="40vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={activeIndex}
          slides={images.map((src) => ({ src, alt: roomName }))}
          plugins={[Zoom, Thumbnails, Counter]}
        />
      </>
    );
  }

  // ─── Layout: 3+ รูป (Main + Grid ด้านขวา) ────────────────────────────────
  const mainImage = images[0];
  const sideImages = images.slice(1, 5); // แสดงสูงสุด 4 รูปด้านขวา
  const remaining = images.length - 5; // รูปที่เหลือ (ถ้า > 5)

  return (
    <>
      <div className="grid grid-cols-3 gap-3 h-[460px]">
        {/* Main image (ใหญ่ 2/3) */}
        <div
          className="col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={mainImage}
            alt={`${roomName} - รูปหลัก`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
          <button className="absolute bottom-4 left-4 bg-white/90 hover:bg-white text-stone-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors">
            <Expand className="w-3.5 h-3.5" />
            ดูทั้งหมด {images.length} รูป
          </button>
        </div>

        {/* Side grid (1/3) */}
        <div className="grid grid-rows-2 gap-3">
          {sideImages.slice(0, 2).map((src, i) => {
            const imageIndex = i + 1;
            const isLast = i === 1 && remaining > 0;

            return (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(imageIndex)}
              >
                <Image
                  src={src}
                  alt={`${roomName} - รูปที่ ${imageIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="20vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                {/* Overlay "+N" สำหรับรูปสุดท้าย */}
                {isLast && remaining > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      +{remaining + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Thumbnail strip (ถ้ามี 4+ รูป) */}
      {images.length >= 4 && (
        <ThumbnailStrip
          images={images}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          onOpenLightbox={openLightbox}
        />
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={activeIndex}
        on={{ view: ({ index }) => setActiveIndex(index) }}
        slides={images.map((src) => ({ src, alt: roomName }))}
        plugins={[Zoom, Thumbnails, Counter]}
        thumbnails={{ border: 0, borderRadius: 8, padding: 4, gap: 8 }}
        counter={{ container: { style: { top: 16, left: 16 } } }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </>
  );
}

// ─── Thumbnail strip ──────────────────────────────────────────────────────────
function ThumbnailStrip({
  images,
  activeIndex,
  onSelect,
  onOpenLightbox,
}: {
  images: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onOpenLightbox: (i: number) => void;
}) {
  return (
    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
      {images.map((src, i) => (
        <button
          key={i}
          onClick={() => {
            onSelect(i);
            onOpenLightbox(i);
          }}
          className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
            activeIndex === i
              ? "border-stone-900 opacity-100"
              : "border-transparent opacity-60 hover:opacity-90"
          }`}
        >
          <Image
            src={src}
            alt={`thumbnail ${i + 1}`}
            fill
            className="object-cover"
            sizes="80px"
          />
        </button>
      ))}
    </div>
  );
}
