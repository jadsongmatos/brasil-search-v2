import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { cn } from "@/lib/utils"
import { CepPrefetchBackground } from "@/components/cep-prefetch-background"

export const metadata: Metadata = {
  title: "Brasil Search - Busca CEPs e Informações do Brasil",
  description: "Busque informações sobre CEPs, cidades e muito mais do Brasil com Google Custom Search integrado",
  keywords: "CEP, Brasil, busca, endereço, código postal, cidades, estados, Google CSE",
  authors: [{ name: "Brasil Search" }],
  openGraph: {
    title: "Brasil Search",
    description: "Busque informações sobre CEPs, cidades e muito mais do Brasil",
    type: "website",
    locale: "pt_BR",
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
        {/* Google CSE Meta Tags */}
        <meta name="google-site-verification" content="K6n_i0D944OJIJwD-M5iQ-jy3oAKFS5aTTL3uJOpy9I" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://your-domain.com" />
        {/* Enhanced global error handler for CSE selector issues */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global CSE state management
              window.__cseLoaded = false;
              window.__cseInitialized = false;

              // Global error handler for CSE selector issues
              window.addEventListener('error', function(e) {
                if (e.message && (e.message.includes('querySelector') || e.message.includes('gsc.tab'))) {
                  console.warn('CSE selector error handled globally:', e.message);
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);

              // Override console.error to filter CSE errors
              const originalConsoleError = console.error;
              console.error = function(...args) {
                const message = args.join(' ');
                if (message.includes('querySelector') && message.includes('gsc.tab')) {
                  console.warn('CSE error filtered:', message);
                  return;
                }
                originalConsoleError.apply(console, args);
              };

              // Enhanced querySelector override
              const originalQuerySelector = Document.prototype.querySelector;
              const originalQuerySelectorAll = Document.prototype.querySelectorAll;

              Document.prototype.querySelector = function(selector) {
                try {
                  if (selector.includes('#gsc.tab=') || selector.includes('.tab=') || selector.match(/[#.][^#.\\s]*=/)) {
                    console.warn('Invalid selector intercepted globally:', selector);
                    return null;
                  }
                  return originalQuerySelector.call(this, selector);
                } catch (error) {
                  console.warn('Global querySelector error:', error);
                  return null;
                }
              };

              Document.prototype.querySelectorAll = function(selector) {
                try {
                  if (selector.includes('#gsc.tab=') || selector.includes('.tab=') || selector.match(/[#.][^#.\\s]*=/)) {
                    console.warn('Invalid selector intercepted globally:', selector);
                    return document.createDocumentFragment().querySelectorAll('div');
                  }
                  return originalQuerySelectorAll.call(this, selector);
                } catch (error) {
                  console.warn('Global querySelectorAll error:', error);
                  return document.createDocumentFragment().querySelectorAll('div');
                }
              };
            `,
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        {children}
        {/* Background CEP prefetching */}
        <CepPrefetchBackground />
      </body>
    </html>
  )
}
