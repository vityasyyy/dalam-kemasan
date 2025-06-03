import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as motion from "motion/react-client";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<form>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<motion.h1
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								duration: 0.4,
								scale: {
									type: "spring",
									visualDuration: 0.4,
									bounce: 0.5,
								},
							}}
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								textAlign: "center",
								width: "100%",
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							Dalam Kemasan
						</motion.h1>
					</div>
					<div className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-3">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
							</div>
							<Input id="password" type="password" required />
							<a
								href="#"
								className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Button type="submit" className="w-full">
							Login
						</Button>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<a
								href="#"
								className="underline underline-offset-4">
								Sign up
							</a>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
