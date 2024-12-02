import Link from "next/link";
import type React from "react";

const Footer: React.FC = () => {
    return (
        <footer aria-labelledby="footer-heading" className="mx-auto w-full">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 xl:py-8">
                <FooterContent />
            </div>
        </footer>
    );
};
export default Footer;

const FooterContent: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <FooterText />
    </div>
);

const FooterText: React.FC = () => (
    <span className="md:text-base">
        <FooterLink href="https://example.com" text="example" rel="noopener noreferrer" /> © 2024
        <br />
        <FooterLink href="/disclaimer" text="免責事項" rel="noopener" />
        {" | "}
        <FooterLink href="/privacy-policy" text="プライバシーポリシー" />
        <br />
        <FooterLink href="/open-source-licenses" text="Open Source Licenses" />
        <br />
        Hosted by <FooterLink href="https://vercel.com/" text="Vercel" rel="noopener noreferrer" />
    </span>
);

const FooterLink: React.FC<FooterLinkProps> = ({ href, text, rel }) => (
    <Link href={href} rel={rel} className="mx-1 text-light-accent">
        {text}
    </Link>
);

interface FooterLinkProps {
    href: string;
    text: string;
    rel?: string;
}
