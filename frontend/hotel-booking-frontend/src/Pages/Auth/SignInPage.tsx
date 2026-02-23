import { SignInPageLayout } from "../../components/Auth/SignIn";
import { useSignIn } from "../../hooks/useSignIn";

export default function SignInPage() {
  const { email, setEmail, error, loading, handleSubmit } = useSignIn();

  return (
    <SignInPageLayout
      email={email}
      setEmail={setEmail}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}