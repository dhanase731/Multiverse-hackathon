import { useNavigate } from 'react-router-dom'

export default function GoogleSignIn() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-background font-body-md">
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-margin_page py-margin_page">
        {/* Auth Card */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-stack_gap_lg flex flex-col items-center text-center">
          {/* Product Logo */}
          <div className="mb-stack_gap_lg">
            <img 
              alt="Email Reply Assistance Logo" 
              className="w-24 h-24 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUBUVbvZ0IqNakDgb8Ms5bGLKy-6aCsrJRDgnT9rAdQjo62t-KSV6fFBV6xvLk_ZHfItzx6vNQcHRnlQSYf8HKM982JRP3DFb6QjTyLd4E8CdWpL3S_EQku5CVClgu6Vb6YF6ORZecMYQtm0VNQtrEqdT4K_HNInATT0RITP1IDCP0gjHlrL3yXm6F3b9j8Y60PuvvRPKQnVP3qlPqJTE7KJ2ukKJLWh_XZuSZaK6utiE6wCNN20pE"
            />
          </div>
          {/* Identity */}
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack_gap_sm">
            Welcome back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px] mb-stack_gap_lg">
            Sign in to Email Reply Assistance to continue to your workspace
          </p>
          {/* Google OAuth Button */}
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full flex items-center justify-center gap-stack_gap_sm py-3 px-stack_gap_md border border-outline-variant rounded-full font-label-md text-on-surface-variant hover:bg-surface-container transition-all active:scale-95 duration-150 group cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-body-md font-semibold text-on-surface">Sign in with Google</span>
          </button>
          {/* Secondary Actions */}
          <div className="mt-stack_gap_lg flex flex-col gap-stack_gap_sm w-full">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-label-sm font-label-sm text-outline uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            <button className="text-primary font-label-md hover:underline transition-all cursor-pointer bg-transparent border-none">
              Use single sign-on (SSO)
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer Component */}
      <footer className="w-full py-stack_gap_lg flex flex-col items-center justify-center gap-stack_gap_sm bg-surface-container-lowest border-t border-outline-variant">
        <div className="flex gap-stack_gap_md">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Support</a>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © 2024 Email Reply Assistance. Powered by Advanced AI.
        </p>
      </footer>
    </div>
  )
}
