import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/student/dashboard" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white">
        <GraduationCap size={20} />
      </div>

      <div className="text-xl font-bold text-white">
        <span>EDU</span>
        <span className="text-sky-400">Pulse</span>
      </div>
    </Link>
  );
}