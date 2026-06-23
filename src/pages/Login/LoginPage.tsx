import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { AuthService } from "@/services";
import { UI_LABELS } from "@/constants";
import { loginSchema, signupSchema, type LoginFormValues, type SignupFormValues } from "@/features/auth";
import { Button, Input, Card } from "@/components/shared";


export function LoginPage(): React.JSX.Element {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onLoginSubmit = async (values: LoginFormValues): Promise<void> => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await AuthService.signIn(values);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : UI_LABELS.AUTH.ERROR_LOGIN;
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: SignupFormValues): Promise<void> => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await AuthService.signUp(values);
      setAuthError(UI_LABELS.AUTH.SUCCESS_SIGNUP);
      setIsSignUp(false);
      signupForm.reset();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : UI_LABELS.AUTH.ERROR_SIGNUP;
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground select-none">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 items-center justify-center p-12 overflow-hidden border-r border-border">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs tracking-wider uppercase font-semibold">
            {UI_LABELS.AUTH.WORKSPACE_ECOSYSTEM}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            {UI_LABELS.COMMON.APP_NAME}
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            {UI_LABELS.COMMON.TAGLINE}
          </p>
          <div className="pt-8 flex justify-center">
            <div className="w-80 h-48 rounded-lg border border-border/40 bg-zinc-900/60 backdrop-blur-md shadow-2xl p-4 flex flex-col justify-between text-left">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
                <div className="w-12 h-2 bg-secondary rounded"></div>
              </div>
              <div className="space-y-2 py-4">
                <div className="w-full h-3 bg-secondary/80 rounded"></div>
                <div className="w-4/5 h-3 bg-secondary/80 rounded"></div>
                <div className="w-1/2 h-3 bg-secondary/80 rounded"></div>
              </div>
              <div className="w-full h-6 bg-primary/10 rounded border border-primary/20"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {isSignUp ? UI_LABELS.AUTH.CREATE_WORKSPACE : UI_LABELS.AUTH.WELCOME_BACK}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp ? UI_LABELS.AUTH.SIGNUP_SUBTITLE : UI_LABELS.AUTH.LOGIN_SUBTITLE}
            </p>
          </div>

          <Card className="p-8 bg-zinc-900/40 border-border/80 backdrop-blur-lg space-y-6">
            {authError && (
              <div
                className={`p-3 rounded text-sm text-center ${
                  authError.includes("check your email") || authError.includes("verification")
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive-foreground border border-destructive/20"
                }`}
              >
                {authError}
              </div>
            )}

            {isSignUp ? (
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <Input
                  id="signup-name"
                  label={UI_LABELS.AUTH.FIELD_NAME}
                  placeholder="Jane Doe"
                  className="bg-secondary/40"
                  error={signupForm.formState.errors.fullName?.message}
                  {...signupForm.register("fullName")}
                />

                <Input
                  id="signup-email"
                  type="email"
                  label={UI_LABELS.AUTH.FIELD_EMAIL}
                  placeholder="name@workspace.com"
                  className="bg-secondary/40"
                  error={signupForm.formState.errors.email?.message}
                  {...signupForm.register("email")}
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="signup-password">
                    {UI_LABELS.AUTH.FIELD_PASSWORD}
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 bg-secondary/40"
                      error={signupForm.formState.errors.password?.message}
                      {...signupForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[10px] text-muted-foreground hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-2.5"
                >
                  <UserPlus size={16} />
                  <span>{UI_LABELS.AUTH.SIGN_UP}</span>
                </Button>
              </form>
            ) : (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <Input
                  id="login-email"
                  type="email"
                  label={UI_LABELS.AUTH.FIELD_EMAIL}
                  placeholder="name@workspace.com"
                  className="bg-secondary/40"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register("email")}
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="login-password">
                    {UI_LABELS.AUTH.FIELD_PASSWORD}
                  </label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 bg-secondary/40"
                      error={loginForm.formState.errors.password?.message}
                      {...loginForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[10px] text-muted-foreground hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-2.5"
                >
                  <LogIn size={16} />
                  <span>{UI_LABELS.AUTH.LOG_IN}</span>
                </Button>
              </form>
            )}

            <div className="text-center pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                {isSignUp ? UI_LABELS.AUTH.TO_LOGIN_LINK : UI_LABELS.AUTH.TO_SIGNUP_LINK}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
