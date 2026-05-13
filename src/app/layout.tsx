import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hamidsharifi.com"),
  title: "Hamid Sharifi | Web Designer and Developer in Winston Salem NC",
  description:
    "Web designer and developer based in Winston Salem NC. I build fast, accessible websites with strong UI UX and clean code. Serving Winston Salem, Greensboro, High Point, and nearby areas.",
  keywords:
    "graphic designer Winston-Salem NC, web designer Winston-Salem, UI UX designer North Carolina, web developer Winston-Salem, branding Greensboro NC, web design High Point NC, graphic design Kernersville, web development Clemmons NC, logo design North Carolina, Hamid Sharifi designer",
  openGraph: {
    title: "Hamid Sharifi | Web Designer and Developer in Winston Salem NC",
    description:
      "Web designer and developer based in Winston Salem NC. I build fast, accessible websites with strong UI UX and clean code. Serving Winston Salem, Greensboro, High Point, and nearby areas.",
    url: "https://www.hamidsharifi.com",
    siteName: "Hamid Sharifi",
    images: [
      {
        url: "https://www.hamidsharifi.com/hamidsharifi-og.jpg",
        width: 1200,
        height: 630,
        alt: "Hamid Sharifi — Designer & Developer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamid Sharifi | Web Designer and Developer in Winston Salem NC",
    description:
      "Web designer and developer based in Winston Salem NC. I build fast, accessible websites with strong UI UX and clean code. Serving Winston Salem, Greensboro, High Point, and nearby areas.",
    images: ["https://www.hamidsharifi.com/hamidsharifi-og.jpg"],
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.hamidsharifi.com/#person",
      name: "Hamid Sharifi",
      jobTitle: "Designer & Developer",
      description:
        "10+ years of experience in graphic design, UI/UX, and web development. Based in Winston-Salem, NC.",
      url: "https://www.hamidsharifi.com",
      email: "hamid@tandem78.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Winston-Salem",
        addressRegion: "NC",
        addressCountry: "US",
      },
      knowsAbout: [
        "Graphic Design",
        "UI/UX Design",
        "Web Design",
        "Web Development",
        "Branding",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.hamidsharifi.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much does a website cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every project is different. Pricing depends on scope, number of pages, custom features, and timeline. I'll provide a clear, detailed quote after a brief discovery call.",
          },
        },
        {
          "@type": "Question",
          name: "How long does it take to build a website?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A typical website takes 4 to 8 weeks from kickoff to launch. More complex projects with custom functionality can take longer. You'll receive a clear timeline before any work begins.",
          },
        },
        {
          "@type": "Question",
          name: "Do you provide photos, images, and website copy (text)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Content is what makes a website truly work. If you don't have professional photography or written copy ready, you can hire your own, or I can connect you with trusted photographers and copywriters from my network whose fees are billed directly to you. Where stock imagery makes sense, I can source it for you and that cost is also passed on to you at cost.",
          },
        },
        {
          "@type": "Question",
          name: "What do I need to provide before we start?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Typically: your brand assets (logo, colours, fonts), any existing content (text and photos), a few websites you like the look of, and a clear idea of your goals. Don't worry if you're missing some of it. We'll figure it out together.",
          },
        },
        {
          "@type": "Question",
          name: "Will my website be mobile-friendly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Every website I build is fully responsive and tested across phones, tablets, and desktops to make sure it looks great and works perfectly on every screen size.",
          },
        },
        {
          "@type": "Question",
          name: "Can I update the website myself after it's built?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Depending on your needs, I can build on a CMS that lets you edit content without touching code. I'll also walk you through everything at handover so you feel confident managing it.",
          },
        },
        {
          "@type": "Question",
          name: "Do you handle hosting and domain setup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. I can recommend reliable hosting providers, help you register a domain, and handle the full technical setup so you don't have to deal with any of it.",
          },
        },
        {
          "@type": "Question",
          name: "What happens after the website launches?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "I include a post-launch support window to catch any issues. After that, I offer ongoing maintenance packages covering updates, security monitoring, and performance checks.",
          },
        },
        {
          "@type": "Question",
          name: "Will my website be optimised for search engines (SEO)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Every site I build follows SEO best practices: clean code, fast load times, proper meta tags, structured data, and mobile optimisation. For deeper SEO work like content strategy or link building, I can refer you to a specialist.",
          },
        },
        {
          "@type": "Question",
          name: "Can you redesign my existing website?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. Whether you need a full visual overhaul or improvements to performance and UX, I can work with your existing content or start completely fresh. We'll figure out which approach makes more sense for your goals.",
          },
        },
        {
          "@type": "Question",
          name: "What does the payment process look like?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Projects are split into milestones: a deposit upfront to kick things off, a payment at design approval, and the final payment before launch. I accept bank transfer and major credit cards.",
          },
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.hamidsharifi.com/#business",
      name: "Hamid Sharifi — Designer & Developer",
      description:
        "Graphic design, UI/UX, and web development services in Winston-Salem, NC. Serving Winston-Salem, Greensboro, High Point, Kernersville, Clemmons, Lewisville, and all of North Carolina.",
      url: "https://www.hamidsharifi.com",
      email: "hamid@tandem78.com",
      founder: { "@id": "https://www.hamidsharifi.com/#person" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Winston-Salem",
        addressRegion: "NC",
        addressCountry: "US",
      },
      areaServed: [
        "Winston-Salem, NC",
        "Greensboro, NC",
        "High Point, NC",
        "Kernersville, NC",
        "Clemmons, NC",
        "Lewisville, NC",
        "Lexington, NC",
        "Salisbury, NC",
        "North Carolina",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Design & Development Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Branding" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "UI/UX Design" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Web Design" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Web Development" },
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta
          name="build-info"
          content={`hamidsharifi.com — Last published: ${new Date().toUTCString()} — © ${new Date().getFullYear()} Hamid Sharifi. All rights reserved.`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <Script
          id="recaptcha-v3"
          strategy="afterInteractive"
          src="https://www.google.com/recaptcha/api.js?render=6Lc-TecsAAAAAAlJ1nVabKrGtdQTw3DkZZlmSled"
        />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P6NBQBKK');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6NBQBKK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
