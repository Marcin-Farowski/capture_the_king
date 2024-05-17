import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-zinc-950">
      <div className="flex justify-center mx-auto flex-col max-w-screen-xl min-h-screen items-center bg-zinc-950 px-4 pb-8">
        <h1 className="pb-3 text-4xl font-semibold text-zinc-50">
          404 - Strona nie znaleziona
        </h1>
        <h2 className="pb-12 text-md font-light text-zinc-50">
          Przepraszamy, ale strona, której szukasz, nie istnieje.
        </h2>
        <p className="pb-6 text-md font-light text-zinc-50">
          Możesz wrócić na{" "}
          <Link
            href="https://capture-the-king.vercel.app"
            className="underline"
          >
            stronę główną
          </Link>{" "}
          lub sprawdzić poniższe linki:
        </p>
        <div className="flex w-full gap-10 justify-center text-xs font-thin text-zinc-200">
          <Link href="https://pl-wiki.metin2.gameforge.com/index.php/Schwytaj_Kr%C3%B3la">
            Schwytaj Króla Wiki
          </Link>
          <Link href="https://github.com/Marcin-Farowski/capture_the_king">
            GitHub
          </Link>
        </div>
      </div>
    </main>
  );
}
