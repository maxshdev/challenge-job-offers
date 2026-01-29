import Link from "next/link";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/src/components/ThemeToggle";

export default function Navbar() {

    const t = useTranslations('Public');

    return (
        <header className="navbar bg-base-100 shadow-md px-6">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    { t('Header.home') }
                </Link>
            </div>
            <nav className="hidden md:flex gap-2">
                <Link href="#features" className="btn btn-ghost rounded-btn">
                    { t('Header.features') }
                </Link>
                <Link href="#pricing" className="btn btn-ghost rounded-btn">
                    { t('Header.pricing') }
                </Link>
                <Link href="/jobs" className="btn btn-ghost rounded-btn">
                    { t('Header.jobs') }
                </Link>
                <Link href="/job-alerts/subscribe" className="btn btn-ghost rounded-btn">
                    { t('Header.job-alerts') }
                </Link>
                <Link href="#contact" className="btn btn-ghost rounded-btn">
                    { t('Header.contact') }
                </Link>
                <Link href="/login" className="btn btn-ghost rounded-btn">
                    { t('Header.signin') }
                </Link>
            </nav>
            <div className="ml-4">
                <Link href="/signup" className="btn btn-primary">
                    { t('Header.signup') }
                </Link>
            </div>
            <div className="ml-4">
                <ThemeToggle />
            </div>
        </header>
    );
}