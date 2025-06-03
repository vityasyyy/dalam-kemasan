"use client";
import Container from "@/components/container";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Box } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
	{
		label: "Sign up",
		href: "/register",
	},
];

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 10);
	});

	return (
		<main
			className={cn(
				`fixed flex items-center inset-x-0 justify-between py-3 px-12 transition-all top-4 mx-auto w-full max-w-4xl rounded-3xl z-50 bg-transparent ease-out  duration-200`,
				{
					"max-w-2xl border border-accent bg-background/20 backdrop-blur-md px-8":
						isScrolled,
				}
			)}>
			<section>
				<Link
					href={`/`}
					className="flex gap-2 font-bold text-lg items-center text-neutral-200">
					<Box />
					in-box
				</Link>
			</section>
			<section className="flex gap-2">
				{NAV_LINKS.map((link) => (
					<Link href={link.href} key={link.label}>
						<Button variant={`link`}>{link.label}</Button>
					</Link>
				))}
				<Link href={`/login`}>
					<ShimmerButton
						className="px-4 text-sm h-9"
						borderRadius="5px"
						background="rgba(6, 64, 43)">
						Login
					</ShimmerButton>
				</Link>
			</section>
		</main>
	);
};

export default Navbar;
