import Board from "@/components/Board";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 pt-16">
      <h1 className="mb-12 text-4xl font-semibold font-bold text-zinc-50">
        Schwytaj Króla
      </h1>
      <Board />
    </main>
  );
}
