import { SignupForm } from "@/components/signup-form";
import { PageLayout } from "@/components/layouts/page-layout";

export default function RegisterPage() {
  return (
    <PageLayout maxWidth="sm" className="min-h-svh flex items-center justify-center">
      <SignupForm />
    </PageLayout>
  );
}
