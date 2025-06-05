"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Lock, Zap } from "lucide-react";
import { useState } from "react";

interface UpgradeModalProps {
	children: React.ReactNode;
}

const UpgradeModal = ({ children }: UpgradeModalProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpgrade = async () => {
		setIsLoading(true);
		// Simulate payment processing
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsLoading(false);
		// Here you would integrate with your payment processor (Stripe, etc.)
		alert("Upgrade successful! Welcome to Premium!");
	};

	const premiumFeatures = [
		"100 GB storage",
		"Unlimited file uploads",
		"Team collaboration",
		"Priority support",
		"Advanced security",
		"File versioning",
		"Custom branding",
		"API access",
		"Advanced analytics",
		"No ads",
	];

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-yellow-500" />
						Upgrade to Premium
					</DialogTitle>
					<DialogDescription>
						Unlock all features and get the most out of in-box
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Pricing */}
					<Card>
						<CardHeader className="text-center pb-4">
							<Badge className="w-fit mx-auto mb-2">
								Most Popular
							</Badge>
							<CardTitle className="text-2xl">
								Premium Plan
							</CardTitle>
							<div className="space-y-1">
								<p className="text-3xl font-bold">
									$9.99
									<span className="text-sm font-normal text-muted-foreground">
										/month
									</span>
								</p>
								<p className="text-sm text-muted-foreground">
									Billed monthly, cancel anytime
								</p>
							</div>
						</CardHeader>
					</Card>

					{/* Features */}
					<div className="space-y-3">
						<h4 className="font-medium">What you'll get:</h4>
						<div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
							{premiumFeatures.map((feature) => (
								<div
									key={feature}
									className="flex items-center gap-2 text-sm">
									<Check className="h-4 w-4 text-green-500 flex-shrink-0" />
									<span>{feature}</span>
								</div>
							))}
						</div>
					</div>

					{/* Security Notice */}
					<div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
						<Lock className="h-4 w-4" />
						<span>Secure payment powered by Stripe</span>
					</div>

					{/* Actions */}
					<div className="space-y-3">
						<Button
							className="w-full"
							onClick={handleUpgrade}
							disabled={isLoading}>
							<CreditCard className="h-4 w-4 mr-2" />
							{isLoading ? "Processing..." : "Upgrade Now"}
						</Button>
						<p className="text-xs text-center text-muted-foreground">
							You can cancel your subscription at any time. No
							hidden fees.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default UpgradeModal;
