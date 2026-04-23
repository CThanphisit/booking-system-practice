import SearchBar from "./SearchBar";
import { SearchParams } from "@/types";

type Props = {
  onSearch: (params: Partial<SearchParams>) => void;
};

const STATS = [
  { value: "50+", label: "ห้องพัก" },
  { value: "4.9", label: "คะแนนเฉลี่ย" },
  { value: "1,200+", label: "แขกพึงพอใจ" },
];

export default function HeroSection({ onSearch }: Props) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-stone-950 overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 60px,
            rgba(255,255,255,0.5) 60px, rgba(255,255,255,0.5) 61px
          ), repeating-linear-gradient(
            90deg, transparent, transparent 60px,
            rgba(255,255,255,0.5) 60px, rgba(255,255,255,0.5) 61px
          )`,
        }}
      />

      {/* Amber glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-px bg-amber-500" />
          <span className="text-amber-400 text-sm tracking-widest uppercase font-medium">
            ที่พักระดับพรีเมียม
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
          พักผ่อน
          <br />
          <span className="text-amber-400">อย่างมีสไตล์</span>
        </h1>

        <p className="text-stone-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          เลือกห้องพักที่ตรงกับความต้องการ ตั้งแต่ Standard ไปจนถึง Suite หรูพร้อมวิว Panoramic
        </p>

        {/* Search bar */}
        <div className="mb-12">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              {i > 0 && <div className="w-px h-8 bg-stone-700" />}
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-stone-500 text-sm mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />
    </section>
  );
}
