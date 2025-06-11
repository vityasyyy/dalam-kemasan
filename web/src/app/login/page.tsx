import { LoginForm } from "@/components/login-form";
import { PageLayout } from "@/components/layouts/page-layout";

export default function LoginPage() {
  return (
    <PageLayout
      maxWidth="sm"
      className="min-h-svh flex items-center justify-center"
    >
      <LoginForm />
    </PageLayout>
  );
}
