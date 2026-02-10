"use client";

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
    const { login } = useAuth();

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
            <div className="hidden lg:block relative bg-slate-900">
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
            <div className="flex flex-col items-center justify-center p-8 sm:p-20 bg-slate-950">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-black tracking-tighter text-white">Create Identity</h1>
                        <p className="mt-4 text-xs font-black text-slate-500 uppercase tracking-widest leading-loose">
                            Existing user?{" "}
                            <Link href="/login" className="text-first-color hover:underline">
                                Identify Session
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
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2.5">Subject Designation / Full Name</label>
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
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:ring-1 focus:ring-first-color/50 focus:border-first-color/50 outline-none transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2.5">Neural ID / Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="user@neural.cluster"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:ring-1 focus:ring-first-color/50 focus:border-first-color/50 outline-none transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2.5">Access Key / Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:ring-1 focus:ring-first-color/50 focus:border-first-color/50 outline-none transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2.5">Confirm Identity Key</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:ring-1 focus:ring-first-color/50 focus:border-first-color/50 outline-none transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-start mt-2">
                            <input id="terms" type="checkbox" required className="h-4 w-4 mt-1 text-first-color focus:ring-first-color border-white/5 bg-slate-900 rounded cursor-pointer" />
                            <label htmlFor="terms" className="ml-2 block text-[10px] font-black uppercase tracking-widest text-slate-600 leading-relaxed cursor-pointer">
                                I accept the <a href="#" className="text-first-color hover:underline">Neural Directives</a> and <a href="#" className="text-first-color hover:underline">Privacy Protocols</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-5 px-4 rounded-2xl shadow-xl text-xs font-black uppercase tracking-[0.2em] text-white bg-first-color hover:bg-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-first-color group disabled:opacity-50 disabled:cursor-not-allowed shadow-first-color/20 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Authorize Identity <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="relative mt-12">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-6 bg-slate-950 font-black text-slate-600 uppercase tracking-[0.3em]">External Proxy</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <button className="flex items-center justify-center px-6 py-4 border border-white/5 rounded-2xl shadow-sm bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 hover:text-white transition-all group">
                            <svg className="h-4 w-4 mr-3 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" />
                            </svg>
                            Authorize via Google Cluster
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
