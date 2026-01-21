import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Lock, User, ArrowRight, Github, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth(); // We might use this later or auto-login

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:8000/auth/register", {
                email: formData.email,
                full_name: formData.full_name
            }, {
                params: { password: formData.password }
            });

            // Auto-login or redirect to login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Image Scenery */}
            <div className="hidden lg:block relative bg-slate-900 relative">
                <Image
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974"
                    alt="Fashion Model"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute bottom-20 left-12 right-12 text-white">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-300 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <h2 className="text-5xl font-black tracking-tighter mb-4 leading-tight">
                        Join the Revolution <br />
                        <span className="text-first-color">Fashion Fiesta</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                        Create an account to unlock exclusive member-only deals, speedy checkout, and personalized style recommendations.
                    </p>
                </div>
            </div>

            {/* Right: Register Form */}
            <div className="flex flex-col items-center justify-center p-8 sm:p-20 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Create an Account</h1>
                        <p className="mt-2 text-sm font-bold text-slate-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-first-color hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="John Doe"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-first-color focus:border-transparent outline-none transition-all placeholder:font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-first-color focus:border-transparent outline-none transition-all placeholder:font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a password"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-first-color focus:border-transparent outline-none transition-all placeholder:font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Confirm password"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-first-color focus:border-transparent outline-none transition-all placeholder:font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-start mt-2">
                            <input id="terms" type="checkbox" required className="h-4 w-4 mt-1 text-first-color focus:ring-first-color border-gray-300 rounded" />
                            <label htmlFor="terms" className="ml-2 block text-xs font-bold text-slate-500 leading-relaxed">
                                By creating an account, I agree to our <a href="#" className="underline hover:text-slate-900">Terms of Service</a> and <a href="#" className="underline hover:text-slate-900">Privacy Policy</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-slate-900 hover:bg-first-color transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-first-color group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="relative mt-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white font-bold text-slate-400">Or register with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button className="flex items-center justify-center px-4 py-3 border border-slate-100 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center px-4 py-3 border border-slate-100 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            <Github className="h-5 w-5 mr-2 text-slate-800" />
                            GitHub
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

