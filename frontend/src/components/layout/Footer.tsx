
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">V</span>
                            </div>
                            <span className="font-bold text-xl text-slate-800">Verbo</span>
                        </div>
                        <p className="text-slate-500 text-base leading-relaxed max-w-sm mb-6">
                            Making language learning accessible, neuro-friendly, and genuinely enjoyable for everyone.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Github size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                        </div>
                    </div>

                    <FooterColumn title="Product">
                        <FooterLink href="#">Features</FooterLink>
                        <FooterLink href="#">Pricing</FooterLink>
                        <FooterLink href="#">Enterprise</FooterLink>
                        <FooterLink href="#">Changelog</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="Resources">
                        <FooterLink href="#">Community</FooterLink>
                        <FooterLink href="#">Help Center</FooterLink>
                        <FooterLink href="#">Blog</FooterLink>
                        <FooterLink href="#">Status</FooterLink>
                    </FooterColumn>

                    <FooterColumn title="Company">
                        <FooterLink href="#">About</FooterLink>
                        <FooterLink href="#">Careers</FooterLink>
                        <FooterLink href="#">Legal</FooterLink>
                        <FooterLink href="#">Contact</FooterLink>
                    </FooterColumn>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Verbo Inc. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <h4 className="font-semibold text-slate-900 mb-6">{title}</h4>
            <ul className="space-y-4">
                {children}
            </ul>
        </div>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-slate-500 hover:text-primary-600 transition-colors font-medium">
                {children}
            </Link>
        </li>
    )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-200 transition-all">
            {icon}
        </a>
    )
}
