import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { cn } from "@/lib/utils"
import { CepPrefetchBackground } from "@/components/cep-prefetch-background"
import { MuiThemeProvider } from "@/components/mui-theme-provider"

export const metadata: Metadata = {
  metadataBase: new URL("https://v0-brasil-search.vercel.app"),
  title: {
    default: "Brasil Search - Busca CEPs e Informações do Brasil",
    template: "%s | Brasil Search",
  },
  description: "Busque informações sobre CEPs, cidades e muito mais do Brasil",
  keywords: "CEP, Brasil, busca, endereço, código postal, cidades, estados, consulta CEP",
  authors: [{ name: "Brasil Search" }],
  creator: "Brasil Search",
  publisher: "Brasil Search",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Brasil Search",
    description: "Busque informações sobre CEPs, cidades e muito mais do Brasil",
    url: "https://v0-brasil-search.vercel.app",
    siteName: "Brasil Search",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Brasil Search Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasil Search - Busca CEPs e Informações do Brasil",
    description: "Busque informações sobre CEPs, cidades e muito mais do Brasil",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://v0-brasil-search.vercel.app",
  },
  generator: "v0.app",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* CRITICAL: querySelector protection MUST load FIRST */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                
                var origQS = Document.prototype.querySelector;
                var origQSA = Document.prototype.querySelectorAll;
                var origElemQS = Element.prototype.querySelector;
                var origElemQSA = Element.prototype.querySelectorAll;

                function isBadSelector(sel) {
                  return typeof sel === 'string' && /[#.][^\\s#.\\[\\]\$$\$$]+[=]/.test(sel);
                }

                Document.prototype.querySelector = function(s) {
                  if (isBadSelector(s)) return null;
                  try { return origQS.call(this, s); } catch(e) { return null; }
                };

                Document.prototype.querySelectorAll = function(s) {
                  if (isBadSelector(s)) return [];
                  try { return origQSA.call(this, s); } catch(e) { return []; }
                };

                Element.prototype.querySelector = function(s) {
                  if (isBadSelector(s)) return null;
                  try { return origElemQS.call(this, s); } catch(e) { return null; }
                };

                Element.prototype.querySelectorAll = function(s) {
                  if (isBadSelector(s)) return [];
                  try { return origElemQSA.call(this, s); } catch(e) { return []; }
                };

                window.addEventListener('error', function(e) {
                  if (e.message && e.message.indexOf('not a valid selector') !== -1) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);

                var origConsoleError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var msg = args.join(' ');
                  if (msg.indexOf('not a valid selector') !== -1 && msg.indexOf('gsc') !== -1) {
                    return;
                  }
                  origConsoleError.apply(console, args);
                };
              })();
            `,
          }}
        />

        {/* Google Site Verification */}
        <meta name="google-site-verification" content="K6n_i0D944OJIJwD-M5iQ-jy3oAKFS5aTTL3uJOpy9I" />

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="theme-color" content="#000000" />

        {/* Google Custom Search Engine - loads AFTER protection */}
        <script async src="https://cse.google.com/cse.js?cx=e7e2e0b1ebd0945c6"></script>

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Brasil Search",
              url: "https://v0-brasil-search.vercel.app",
              description: "Busque informações sobre CEPs, cidades e muito mais do Brasil",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://v0-brasil-search.vercel.app/cep/{search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <MuiThemeProvider>
          {children}
          <CepPrefetchBackground />
        </MuiThemeProvider>
      </body>
    </html>
  )
}
