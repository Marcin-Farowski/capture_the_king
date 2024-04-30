import Board from "@/components/Board/Board";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-zinc-950">
      <h1 className="mb-12 text-4xl font-semibold font-bold text-zinc-50">
        Schwytaj Króla
      </h1>
      <Board />
    </main>
  );
}
