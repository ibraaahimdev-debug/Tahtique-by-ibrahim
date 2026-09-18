import { LayoutGrid } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export interface ScanQRCardProps {
  value?: string; // data to encode in the QR (order URL, vehicle page link, etc.)
  title?: string;
  subtitle?: string;
}

export default function ScanQRCard({
  value = "https://tagtique.com/t/sample-order",
  title = "Scan QR Code",
  subtitle = "Lorem ipsum dolor sit amet consectetur adipisici",
}: ScanQRCardProps) {
  return (
    <div className="relative flex justify-center items-center p-6">
      {/* Glass outer card */}
      <div
        className="
          relative w-full max-w-sm
          rounded-[2rem]
          bg-white/10
          backdrop-blur-xl
          border border-white/40
          shadow-[0_8px_40px_rgba(0,0,0,0.08)]
          px-8 py-10
          flex flex-col items-center gap-6
          overflow-hidden
        "
      >
        {/* subtle diagonal light sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.4) 100%)",
          }}
        />

        {/* Heading row */}
        <div className="relative flex items-center gap-3 z-10">
          <LayoutGrid className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2.5} />
          <h3 className="text-2xl font-semibold text-[#1A1A1A] font-poppins">
            {title}
          </h3>
        </div>

        {/* Subheading */}
        <p className="relative text-center text-[#8A8A8A] text-sm z-10 -mt-2">
          {subtitle}
        </p>

        {/* White QR panel */}
        <div
          className="
            relative z-10
            bg-white
            rounded-2xl
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
            p-6
          "
        >
          <QRCodeSVG
            value={value}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#1A1A1A"
            level="M"
          />
        </div>
      </div>
    </div>
  );
}
