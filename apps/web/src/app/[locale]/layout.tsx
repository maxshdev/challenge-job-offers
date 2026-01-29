import "@/src/app/globals.css";
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import { SessionProvider } from 'next-auth/react';
 
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Cargar mensajes correctos
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (err) {
    notFound();
  }
 
  return (
    <html lang={locale} data-theme="silk">
      <body className="antialiased">
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}