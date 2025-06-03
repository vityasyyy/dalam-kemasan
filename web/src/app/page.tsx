import Hero from "@/modules/home/hero";
import Navbar from "@/modules/home/navbar";
import NavbarResolver from "@/modules/home/navbar-resolver";

export default function Home() {
	return (
		<main className="w-full max-w-4xl border-x border-accent mx-auto flex flex-col gap-4 px-4 py-10 sm:px-8 relative">
			<Navbar />
			<NavbarResolver />
			<Hero />
		</main>
	);
}
