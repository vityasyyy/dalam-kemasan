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
		<Container className="">
			<main
				className={cn(
					`fixed flex items-center justify-between py-3 px-12 transition-all top-4 inset-x-[5%] rounded-3xl z-50 bg-transparent  transition-ease-out duration-200`,
					{
						"inset-x-[13%] border border-accent bg-background px-8":
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
		</Container>
	);
};

export default Navbar;
