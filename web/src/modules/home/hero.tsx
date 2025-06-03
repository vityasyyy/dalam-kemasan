import Container from "@/components/container";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import * as motion from "motion/react-client";

const Hero = () => {
	return (
		<main className="min-h-[80vh] flex flex-col items-center gap-8">
			<div
				className={cn(
					"group rounded-full border border-black/5 bg-neutral-100 text-base mb-4 text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
				)}>
				<AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
					<span className="text-sm">✨ See our services</span>
					<ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
				</AnimatedShinyText>
			</div>
			<motion.h1
				initial={{ opacity: 0, y: -5 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="text-5xl text-center font-heading font-bold">
				The <span className="italic text-green-800"> Open Source </span>{" "}
				Google Drive Alternative
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -5 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className="text-lg text-neutral-500 text-center">
				We are glad to have you here. Explore our content and enjoy your
				stay!
			</motion.p>

			<motion.section
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.4 }}
				className="flex gap-2 mt-4">
				<Button variant={`default`} size={`lg`} className="rounded-sm">
					Get Started
				</Button>
				<Button variant={`outline`} size={`lg`} className="rounded-sm">
					Learn More
				</Button>
			</motion.section>
		</main>
	);
};

export default Hero;
