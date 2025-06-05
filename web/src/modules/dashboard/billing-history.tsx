import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Download, Receipt } from "lucide-react";

// Mock billing history data
const billingHistory = [
	{
		id: "inv_001",
		date: "2025-05-01",
		description: "Premium Plan - Monthly",
		amount: "$9.99",
		status: "paid",
		invoice: true,
	},
	{
		id: "inv_002",
		date: "2025-04-01",
		description: "Premium Plan - Monthly",
		amount: "$9.99",
		status: "paid",
		invoice: true,
	},
	{
		id: "inv_003",
		date: "2025-03-01",
		description: "Premium Plan - Monthly",
		amount: "$9.99",
		status: "paid",
		invoice: true,
	},
	{
		id: "inv_004",
		date: "2025-02-01",
		description: "Premium Plan - Monthly",
		amount: "$9.99",
		status: "failed",
		invoice: false,
	},
	{
		id: "inv_005",
		date: "2025-01-15",
		description: "Premium Plan - First Payment",
		amount: "$9.99",
		status: "paid",
		invoice: true,
	},
];

const getStatusBadge = (status: string) => {
	switch (status) {
		case "paid":
			return (
				<Badge variant="default" className="bg-green-500">
					Paid
				</Badge>
			);
		case "failed":
			return <Badge variant="destructive">Failed</Badge>;
		case "pending":
			return <Badge variant="secondary">Pending</Badge>;
		default:
			return <Badge variant="outline">{status}</Badge>;
	}
};

const BillingHistory = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Receipt className="h-5 w-5" />
					Billing History
				</CardTitle>
				<CardDescription>
					View your past payments and download invoices
				</CardDescription>
			</CardHeader>
			<CardContent>
				{billingHistory.length === 0 ? (
					<div className="text-center py-8">
						<Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium">
							No billing history
						</h3>
						<p className="text-muted-foreground">
							Your billing history will appear here once you make
							your first payment.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{billingHistory.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium">
											{new Date(
												item.date
											).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</TableCell>
										<TableCell>
											{item.description}
										</TableCell>
										<TableCell className="font-medium">
											{item.amount}
										</TableCell>
										<TableCell>
											{getStatusBadge(item.status)}
										</TableCell>
										<TableCell className="text-right">
											{item.invoice &&
											item.status === "paid" ? (
												<Button
													variant="outline"
													size="sm">
													<Download className="h-4 w-4 mr-2" />
													Invoice
												</Button>
											) : (
												<span className="text-muted-foreground text-sm">
													-
												</span>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						{/* Summary */}
						<div className="border-t pt-4">
							<div className="flex justify-between items-center text-sm">
								<span className="text-muted-foreground">
									Total payments this year: $
									{billingHistory
										.filter(
											(item) => item.status === "paid"
										)
										.reduce(
											(sum, item) =>
												sum +
												parseFloat(
													item.amount.replace("$", "")
												),
											0
										)
										.toFixed(2)}
								</span>
								<Button variant="outline" size="sm">
									Export All
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default BillingHistory;
