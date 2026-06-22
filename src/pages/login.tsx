import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { AuthService } from "@/services/auth.service";

// Since we toggle, let's create a dynamic validator based on a toggle state
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Login Form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Initialize Signup Form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await AuthService.signIn(values);
      // Main.tsx will handle the redirect because the auth session updates globally
    } catch (err: any) {
      setAuthError(err.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await AuthService.signUp(values);
      setAuthError("Account created! Please check your email for verification.");
      setIsSignUp(false);
      signupForm.reset();
    } catch (err: any) {
      setAuthError(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground select-none">
      {/* Left Pane - Premium Branding Section (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 items-center justify-center p-12 overflow-hidden border-r border-border">
        {/* Abstract Glowing Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs tracking-wider uppercase font-semibold">
            🚀 The Workspace Ecosystem
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">
            TaskDock
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Dock Your Tasks. Drive Your Progress.
          </p>
          <div className="pt-8 flex justify-center">
            {/* Visual placeholder box simulating the dashboard layout */}
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

      {/* Right Pane - Form Card Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {isSignUp ? "Create Workspace" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp
                ? "Get started with your productivity platform today"
                : "Sign in to manage and drive your progress"}
            </p>
          </div>

          <div className="p-8 bg-zinc-900/40 border border-border/80 backdrop-blur-lg rounded-xl shadow-2xl space-y-6">
            {/* Error / Success Notifications */}
            {authError && (
              <div
                className={`p-3 rounded text-sm text-center ${
                  authError.includes("check your email")
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive-foreground border border-destructive/20"
                }`}
              >
                {authError}
              </div>
            )}

            {/* Forms */}
            {isSignUp ? (
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2 bg-secondary/40 border border-border focus:border-primary rounded-md outline-none text-sm transition"
                    {...signupForm.register("fullName")}
                  />
                  {signupForm.formState.errors.fullName && (
                    <span className="text-xs text-rose-500">{signupForm.formState.errors.fullName.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="name@workspace.com"
                    className="w-full px-4 py-2 bg-secondary/40 border border-border focus:border-primary rounded-md outline-none text-sm transition"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <span className="text-xs text-rose-500">{signupForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-secondary/40 border border-border focus:border-primary rounded-md outline-none text-sm transition pr-10"
                      {...signupForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <span className="text-xs text-rose-500">{signupForm.formState.errors.password.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@workspace.com"
                    className="w-full px-4 py-2 bg-secondary/40 border border-border focus:border-primary rounded-md outline-none text-sm transition"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <span className="text-xs text-rose-500">{loginForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor="login-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-secondary/40 border border-border focus:border-primary rounded-md outline-none text-sm transition pr-10"
                      {...loginForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <span className="text-xs text-rose-500">{loginForm.formState.errors.password.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/95 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Log In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
                className="text-xs text-primary hover:underline"
              >
                {isSignUp ? "Already have an account? Log In" : "Need a workspace? Create an account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
