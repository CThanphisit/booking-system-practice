import {
  Wifi, Tv, Wind, Coffee, Bath, ChefHat,
  BedDouble, Users, CheckCircle2,
} from "lucide-react";

const AMENITY_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  "Wi-Fi":            { icon: <Wifi className="w-5 h-5" />,        label: "Wi-Fi ฟรี" },
  "TV":               { icon: <Tv className="w-5 h-5" />,          label: "โทรทัศน์" },
  "Air Conditioning": { icon: <Wind className="w-5 h-5" />,        label: "เครื่องปรับอากาศ" },
  "Hot Water":        { icon: <CheckCircle2 className="w-5 h-5" />, label: "น้ำอุ่น" },
  "Mini Bar":         { icon: <Coffee className="w-5 h-5" />,       label: "มินิบาร์" },
  "Bathtub":          { icon: <Bath className="w-5 h-5" />,         label: "อ่างอาบน้ำ" },
  "Kitchen":          { icon: <ChefHat className="w-5 h-5" />,      label: "ครัว" },
  "Bunk Bed":         { icon: <BedDouble className="w-5 h-5" />,    label: "เตียงสองชั้น" },
  "Living Room":      { icon: <Users className="w-5 h-5" />,        label: "ห้องนั่งเล่น" },
};

type Props = {
  amenities: string[];
};

export default function RoomAmenities({ amenities }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 mb-4">
        สิ่งอำนวยความสะดวก
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((key) => {
          const item = AMENITY_MAP[key] ?? {
            icon: <CheckCircle2 className="w-5 h-5" />,
            label: key,
          };
          return (
            <div
              key={key}
              className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3"
            >
              <span className="text-stone-500 shrink-0">{item.icon}</span>
              <span className="text-sm text-stone-700">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
