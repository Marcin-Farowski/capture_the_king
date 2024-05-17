import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-950 pt-12">
      <h1 className="mb-3 text-4xl font-semibold text-zinc-50">
        Schwytaj Króla
      </h1>
      <h2 className="mb-12 text-md font-light text-zinc-50">Zdominuj Schwytaj Króla dzięki naszej aplikacji!</h2>
      <Board />
    </main>
  );
}
