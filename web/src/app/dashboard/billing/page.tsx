import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Zap } from "lucide-react";
import BillingHistory from "@/modules/dashboard/billing-history";
import UpgradeModal from "@/modules/dashboard/upgrade-modal";

const tiers = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		description: "Perfect for personal use and small projects",
		features: [
			"5 GB storage",
			"Basic file management",
			"File sharing (public links)",
			"Mobile app access",
			"Email support",
		],
		limitations: [
			"Limited to 100 files",
			"Basic security features",
			"No priority support",
		],
		current: true,
		buttonText: "Current Plan",
		buttonVariant: "outline" as const,
	},
	{
		name: "Premium",
		price: "$9.99",
		period: "per month",
		description: "Advanced features for power users and teams",
		features: [
			"100 GB storage",
			"Advanced file management",
			"Team collaboration",
			"Priority support",
			"Advanced security",
			"File versioning",
			"Custom branding",
			"API access",
			"Unlimited file uploads",
			"Advanced analytics",
		],
		popular: true,
		current: false,
		buttonText: "Upgrade to Premium",
		buttonVariant: "default" as const,
	},
];

export default function BillingPage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Billing & Plans
				</h1>
				<p className="text-muted-foreground">
					Manage your subscription and billing information
				</p>
			</div>

			{/* Current Plan Status */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="h-5 w-5 text-yellow-500" />
						Current Plan
					</CardTitle>
					<CardDescription>
						You are currently on the Free plan
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Free Plan</p>
							<p className="text-sm text-muted-foreground">
								5 GB storage • 100 files limit
							</p>
						</div>
						<Badge variant="secondary">Active</Badge>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">
								Storage used
							</span>
							<span className="font-medium">2.3 GB / 5 GB</span>
						</div>
						<div className="w-full bg-secondary rounded-full h-2">
							<div
								className="bg-primary h-2 rounded-full"
								style={{ width: "46%" }}></div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Pricing Tiers */}
			<div>
				<h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
				<div className="grid md:grid-cols-2 gap-6">
					{tiers.map((tier) => (
						<Card
							key={tier.name}
							className={`relative ${
								tier.popular ? "border-primary shadow-lg" : ""
							}`}>
							{tier.popular && (
								<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
									<Badge className="bg-primary text-primary-foreground">
										<Zap className="h-3 w-3 mr-1" />
										Most Popular
									</Badge>
								</div>
							)}
							<CardHeader className="text-center pb-4">
								<CardTitle className="text-xl">
									{tier.name}
								</CardTitle>
								<div className="space-y-1">
									<p className="text-3xl font-bold">
										{tier.price}
										<span className="text-sm font-normal text-muted-foreground">
											/{tier.period}
										</span>
									</p>
									<CardDescription>
										{tier.description}
									</CardDescription>
								</div>
							</CardHeader>{" "}
							<CardContent className="space-y-4">
								{tier.name === "Premium" ? (
									<UpgradeModal>
										<Button
											className="w-full"
											variant={tier.buttonVariant}
											disabled={tier.current}>
											{tier.buttonText}
										</Button>
									</UpgradeModal>
								) : (
									<Button
										className="w-full"
										variant={tier.buttonVariant}
										disabled={tier.current}>
										{tier.buttonText}
									</Button>
								)}

								<div className="space-y-3">
									<h4 className="font-medium text-sm">
										What's included:
									</h4>
									<ul className="space-y-2">
										{tier.features.map((feature) => (
											<li
												key={feature}
												className="flex items-start gap-2 text-sm">
												<Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
												<span>{feature}</span>
											</li>
										))}
									</ul>
								</div>

								{tier.limitations && (
									<div className="space-y-3 pt-3 border-t">
										<h4 className="font-medium text-sm text-muted-foreground">
											Limitations:
										</h4>
										<ul className="space-y-2">
											{tier.limitations.map(
												(limitation) => (
													<li
														key={limitation}
														className="flex items-start gap-2 text-sm text-muted-foreground">
														<span className="text-muted-foreground mt-0.5">
															•
														</span>
														<span>
															{limitation}
														</span>
													</li>
												)
											)}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			<Separator />

			{/* Billing History */}
			<BillingHistory />
		</div>
	);
}
