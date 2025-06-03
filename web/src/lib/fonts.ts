import { Inter, Lora } from "next/font/google";

const body = Inter({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const heading = Lora({
	variable: "--font-heading",
	subsets: ["latin"],
});

export { body, heading };
