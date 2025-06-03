import Container from "@/components/container";
import { Box, Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
	return (
		<Container className="border-t border-accent bg-background/50">
			<footer className="">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center gap-2 mb-4">
							<Box className="h-6 w-6" />
							<span className="font-bold text-lg">in-box</span>
						</div>
						<p className="text-muted-foreground mb-4 max-w-md">
							Dalam Kemasan - Your trusted file management
							solution. Secure, fast, and reliable storage for all
							your important documents.
						</p>
						<div className="flex gap-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground transition-colors">
								<Github className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground transition-colors">
								<Twitter className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground transition-colors">
								<Linkedin className="h-5 w-5" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-foreground transition-colors">
								<Mail className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* Product Links */}
					<div>
						<h3 className="font-semibold mb-4">Product</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/dashboard"
									className="hover:text-foreground transition-colors">
									Dashboard
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/my"
									className="hover:text-foreground transition-colors">
									My Files
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/shared"
									className="hover:text-foreground transition-colors">
									Shared Files
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/recent"
									className="hover:text-foreground transition-colors">
									Recent
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/starred"
									className="hover:text-foreground transition-colors">
									Starred
								</Link>
							</li>
						</ul>
					</div>

					{/* Company Links */}
					<div>
						<h3 className="font-semibold mb-4">Company</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/about"
									className="hover:text-foreground transition-colors">
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="hover:text-foreground transition-colors">
									Contact
								</Link>
							</li>
							<li>
								<Link
									href="/careers"
									className="hover:text-foreground transition-colors">
									Careers
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="hover:text-foreground transition-colors">
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/press"
									className="hover:text-foreground transition-colors">
									Press
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t border-accent mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
					<div className="text-sm text-muted-foreground">
						© 2025 Dalam Kemasan. All rights reserved.
					</div>
					<div className="flex gap-6 text-sm text-muted-foreground">
						<Link
							href="/privacy"
							className="hover:text-foreground transition-colors">
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-foreground transition-colors">
							Terms of Service
						</Link>
						<Link
							href="/cookies"
							className="hover:text-foreground transition-colors">
							Cookie Policy
						</Link>
					</div>
				</div>
			</footer>
		</Container>
	);
};

export default Footer;
