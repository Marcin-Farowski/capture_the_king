import Link from "next/link";
import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="bg-zinc-950">
      <div className="flex mx-auto flex-col max-w-screen-xl min-h-screen items-center bg-zinc-950 px-4 py-10">
        <h1 className="pb-3 text-4xl font-semibold text-zinc-50">
          Schwytaj Króla
        </h1>
        <h2 className="pb-12 text-md font-light text-zinc-50">Zdominuj Schwytaj Króla dzięki naszej aplikacji!</h2>
        <Board />
        <div className="flex w-full justify-between text-xs font-thin text-zinc-200 mt-auto">
          <Link href="https://pl-wiki.metin2.gameforge.com/index.php/Schwytaj_Kr%C3%B3la">Schwytaj Króla Wiki</Link>
          <Link href="https://github.com/Marcin-Farowski/capture_the_king">GitHub</Link>
        </div>
      </div>
    </main>
  );
}
