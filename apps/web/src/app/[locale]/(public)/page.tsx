import Link from "next/link";
import Navbar from "./home/components/Navbar";
import { useTranslations } from "next-intl";

export default function PublicPage() {

    const t = useTranslations('Public');

    return (
        <main className="min-h-screen bg-base-200">
            {/* Navbar */}
            <Navbar></Navbar>

            {/* Hero */}
            <section className="hero min-h-[60vh] bg-base-200 px-6">
                <div className="hero-content flex-col lg:flex-row-reverse gap-12">
                    <div className="text-center lg:text-left max-w-lg">
                        <h1 className="text-5xl font-bold">{t('Hero.title')}</h1>
                        <p className="py-6 text-lg text-base-content/80">
                            { t('Hero.subtitle') }
                        </p>
                        <div className="flex justify-center lg:justify-start gap-3">
                            <Link href="/docs" className="btn btn-primary">
                                { t('Hero.linkDocs') }
                            </Link>
                            <Link href="/demo" className="btn btn-outline">
                                { t('Hero.linkDemo') }
                            </Link>
                        </div>
                    </div>

                    <div className="card w-full max-w-sm shadow-lg bg-base-100">
                        <div className="card-body">
                            <h2 className="card-title">{t('CardHero.title')}</h2>
                            <p>{t('CardHero.subtitle')}</p>
                            <div className="card-actions justify-end">
                                <Link href="/signup" className="btn btn-success">
                                    {t('CardHero.linkSignUp')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-12 px-6">
                <div className="container mx-auto">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title">{t('Features.title1')}</h3>
                                <p>{t('Features.subtitle1')}</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title">{t('Features.title2')}</h3>
                                <p>{t('Features.subtitle2')}</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title">{t('Features.title3')}</h3>
                                <p>{t('Features.subtitle3')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary text-primary-content py-12 px-6">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-semibold">{t('CTA.title')}</h3>
                        <p className="opacity-90">{t('CTA.subtitle')}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/signup" className="btn btn-accent">
                            {t('CTA.link1')}
                        </Link>
                        <Link href="/pricing" className="btn btn-ghost">
                            {t('CTA.link2')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-200 text-base-content">
                <div>
                    <p className="font-bold">{t('Footer.brand')}</p>
                    <p>© {new Date().getFullYear()} {t('Footer.brand')} — {t('Footer.text')}</p>
                </div>
            </footer>
        </main>
    );
}