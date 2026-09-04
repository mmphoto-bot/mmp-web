import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Home,
  Hotel,
  Sparkles,
  Instagram,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Send,
  MapPin,
  Mail,
  Globe,
  Linkedin,
  Music2,
} from 'lucide-react';

type Lang = 'hr' | 'en';

interface Translations {
  [key: string]: { hr: string; en: string };
}

const t: Translations = {
  navPortfolio:  { hr: 'Portfolio', en: 'Portfolio' },
  navAbout:      { hr: 'O meni',    en: 'About' },
  navServices:   { hr: 'Usluge',    en: 'Services' },
  navContact:    { hr: 'Kontakt',   en: 'Contact' },

  heroTagline: {
    hr: 'Fotografija nekretnina · Ugostiteljstva · Lifestylea',
    en: 'Real estate · Hospitality · Lifestyle photography',
  },
  heroCta: { hr: 'Pogledaj galeriju', en: 'View Gallery' },

  portfolioLabel: { hr: 'Portfolio',       en: 'Portfolio' },
  portfolioTitle: { hr: 'Odabrani radovi', en: 'Selected Work' },

  aboutLabel:           { hr: 'O meni',              en: 'About' },
  aboutSubtitle:        { hr: 'Vizualni storytelling', en: 'Visual storytelling' },
  aboutBio: {
    hr: 'Specijaliziram se za fotografiju nekretnina, ugostiteljstva i lifestylea. Deset godina iskustva u IT sektoru hotelske industrije i četiri godine u digitalnom marketingu daju mi razumijevanje i tehničke i poslovne strane svakog projekta. Svaki projekt tretiram kao priču koju zajedno stvaramo: vizualno, precizno i s jasnim ciljem.',
    en: 'I specialize in real estate, hospitality, and lifestyle photography. Ten years of experience in the IT sector of the hotel industry, along with four years in digital marketing, give me an understanding of both the technical and business sides of every project. I treat every project as a story we create together: visual, precise, and purposeful.',
  },
  aboutCta:             { hr: 'Preuzmi cjenik',      en: 'Download Price List' },
  aboutPhotoPlaceholder:{ hr: 'Vaša fotografija ovdje', en: 'Your photo here' },

  servicesLabel:        { hr: 'Usluge',       en: 'Services' },
  servicesTitle:        { hr: 'Čime se bavim', en: 'What I Do' },
  svcRealEstateTitle:   { hr: 'Nekretnine',   en: 'Real Estate' },
  svcRealEstateDesc: {
    hr: 'Profesionalno fotografiranje nekretnina — od kompaktnih stanova i apartmana do luksuznih vila.',
    en: 'Professional real estate photography — from compact apartments to luxury villas.',
  },
  svcHospitalityTitle: { hr: 'Restorani i hrana', en: 'Restaurants & Food' },
  svcHospitalityDesc: {
    hr: 'Fotografija hrane i restoranskih prostora koja podiže vizualni identitet vašeg objekta i privlači goste.',
    en: "Food and restaurant photography that elevates your venue's visual identity and attracts guests.",
  },
  svcLifestyleTitle: { hr: 'Lifestyle', en: 'Lifestyle' },
  svcLifestyleDesc: {
    hr: 'Autentične lifestyle fotografije koje pričaju priču. Kvaliteta koja rezonira s vašom publikom.',
    en: 'Authentic lifestyle imagery that tells a story. Photos that resonate with your audience and elevate your brand.',
  },

  contactLabel:    { hr: 'Kontakt',  en: 'Contact' },
  contactTitle1:   { hr: 'Radimo',   en: "Let's Work" },
  contactTitle2:   { hr: 'zajedno',  en: 'Together' },
  contactBody: {
    hr: 'Bez obzira prodajete li ili iznajmljujete nekretninu, osvježavate vizualni identitet hotela ili stvarate lifestyle sadržaj — rado ću čuti o vašem projektu.',
    en: "Whether you're listing or renting a property, refreshing your hotel's visual identity, or creating lifestyle content — I'd love to hear about your project.",
  },
  contactLocation: { hr: 'Makarska, Hrvatska', en: 'Makarska, Croatia' },
  inputName:        { hr: 'Vaše ime',           en: 'Your name' },
  inputEmail:       { hr: 'E-mail adresa',      en: 'Email address' },
  inputProjectType: { hr: 'Vrsta projekta',     en: 'Project type' },
  inputMessage:     { hr: 'Opišite svoj projekt...', en: 'Tell me about your project...' },
  btnSend:          { hr: 'Pošalji poruku',     en: 'Send Message' },
  btnSending:       { hr: 'Šaljem...',           en: 'Sending...' },
  msgSent: {
    hr: 'Poruka uspješno poslana. Javit ću vam se uskoro.',
    en: "Message sent successfully. I'll get back to you soon.",
  },
  msgError: {
    hr: 'Došlo je do greške. Pokušajte ponovno ili me kontaktirajte izravno na mate.mihaljevic@plenus.hr.',
    en: 'Something went wrong. Please try again or contact me directly at mate.mihaljevic@plenus.hr.',
  },

  ptRealEstate: { hr: 'Fotografija nekretnina',   en: 'Real Estate Photography' },
  ptHospitality:{ hr: 'Fotografija ugostiteljstva', en: 'Hospitality Photography' },
  ptLifestyle:  { hr: 'Lifestyle fotografija',    en: 'Lifestyle Photography' },
  ptOther:      { hr: 'Ostalo',                   en: 'Other' },

  footerRights: { hr: 'Sva prava pridržana.', en: 'All rights reserved.' },
  footerCompany: { hr: 'PLENUS d.o.o. za trgovinu i turizam', en: 'PLENUS d.o.o. za trgovinu i turizam' },
  impressumTitle: { hr: 'Impressum', en: 'Impressum' },
  impressumSubtitle: { hr: 'Podaci o tvrtki', en: 'Company Information' },
  impressumBack: { hr: 'Natrag na početnu', en: 'Back to home' },
  impressumFields: {
    hr: [
      ['Naziv tvrtke', 'PLENUS d.o.o. za trgovinu i turizam'],
      ['Sjedište', 'Igrane 155, Igrane, Hrvatska'],
      ['MBS', '060178312'],
      ['OIB', '68616104307'],
      ['MB', '1586688'],
      ['Osnovano', '07.09.2001.'],
      ['Pravni oblik', 'Društvo s ograničenom odgovornošću (d.o.o.)'],
      ['Temeljni kapital', '2.650,00 € (uplaćen u cijelosti)'],
      ['Trgovački sud', 'Trgovački sud u Splitu'],
      ['Direktor', 'Mate Mihaljević'],
    ],
    en: [
      ['Company name', 'PLENUS d.o.o. za trgovinu i turizam'],
      ['Registered office', 'Igrane 155, Igrane, Croatia'],
      ['MBS', '060178312'],
      ['OIB (VAT)', '68616104307'],
      ['MB', '1586688'],
      ['Founded', '07.09.2001.'],
      ['Legal form', 'Limited liability company (d.o.o.)'],
      ['Share capital', '2.650,00 € (fully paid)'],
      ['Commercial court', 'Commercial Court in Split'],
      ['Director', 'Mate Mihaljević'],
    ],
  },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'hr',
  setLang: () => {},
});

function useLang() {
  return useContext(LangCtx);
}

function tx(key: string, lang: Lang): string {
  return t[key]?.[lang] ?? key;
}

interface GalleryImage {
  src: string;
  altHr: string;
  altEn: string;
}

const GALLERY_IMAGES: GalleryImage[] = Array.from({ length: 45 }, (_, i) => {
  const n = i + 1;
  const ext = n <= 39 ? 'webp' : 'jpg';
  return {
    src: `/Foto-${n}.${ext}`,
    altHr: `Fotografija ${n}`,
    altEn: `Photo ${n}`,
  };
});

const SERVICES_CFG = [
  { icon: Home,     titleKey: 'svcRealEstateTitle',  descKey: 'svcRealEstateDesc' },
  { icon: Hotel,    titleKey: 'svcHospitalityTitle', descKey: 'svcHospitalityDesc' },
  { icon: Sparkles, titleKey: 'svcLifestyleTitle',   descKey: 'svcLifestyleDesc' },
];

const PT_KEYS = ['ptRealEstate', 'ptHospitality', 'ptLifestyle', 'ptOther'];

/* ── Color tokens (bone paper monochrome system) ────────────────────────── */

const C = {
  bone:        '#F2EEE6',
  boneLight:   '#FFFFFF',
  ink:         '#111111',
  ink75:       'rgba(17,17,17,0.75)',
  ink65:       'rgba(17,17,17,0.65)',
  ink55:       'rgba(17,17,17,0.55)',
  ink45:       'rgba(17,17,17,0.45)',
  ink25:       'rgba(17,17,17,0.25)',
  ink12:       'rgba(17,17,17,0.12)',
  ink08:       'rgba(17,17,17,0.08)',
  white:       '#FFFFFF',
  white60:     'rgba(255,255,255,0.6)',
  white45:     'rgba(255,255,255,0.45)',
  white30:     'rgba(255,255,255,0.3)',
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── Smooth scroll to section ───────────────────────────────────────────── */

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Scroll progress bar ────────────────────────────────────────────────── */

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

/* ─── Custom cursor (desktop only) ───────────────────────────────────────── */

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId: number | null = null;
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    const animate = () => {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.left = `${curX}px`;
      cursor.style.top = `${curY}px`;
      const dx = Math.abs(mouseX - curX);
      const dy = Math.abs(mouseY - curY);
      if (dx < 0.5 && dy < 0.5) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('[data-cursor="view"]')) cursor.classList.add('active');
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('[data-cursor="view"]')) cursor.classList.remove('active');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={cursorRef} className="cursor-view">View</div>;
}

/* ─── Lightbox ─────────────────────────────────────────────────────────── */

interface LightboxProps {
  images: typeof GALLERY_IMAGES;
  index: number;
  lang: Lang;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, index, lang, onClose, onPrev, onNext }: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const [imgKey, setImgKey] = useState(0);
  const [exitingImg, setExitingImg] = useState<{ img: GalleryImage; dir: 'left' | 'right' } | null>(null);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  const navigate = (dir: 'left' | 'right') => {
    const cur = images[index];
    setExitingImg({ img: cur, dir });
    setTimeout(() => setExitingImg(null), 300);
    setSlideDir(dir);
    setImgKey((k) => k + 1);
    if (dir === 'left') onNext();
    else onPrev();
  };

  const handlePrev = () => navigate('right');
  const handleNext = () => navigate('left');

  useEffect(() => {
    const nextIdx = (index + 1) % images.length;
    const prevIdx = (index - 1 + images.length) % images.length;
    [nextIdx, prevIdx].forEach((i) => {
      const preload = new Image();
      preload.src = images[i].src;
    });
  }, [index, images]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     handleClose();
      if (e.key === 'ArrowLeft')  handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [index]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const img = images[index];

  const overlayAnim = closing
    ? 'lbFadeOut 0.3s ease forwards'
    : 'lbFadeIn 0.3s ease forwards';

  const imgEnterAnim = closing
    ? 'lbClose 0.3s ease forwards'
    : slideDir === 'left'  ? 'lbSlideFromRight 0.3s ease forwards'
    : slideDir === 'right' ? 'lbSlideFromLeft  0.3s ease forwards'
    :                        'lbOpen 0.35s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';

  const imgExitAnim = exitingImg?.dir === 'left'
    ? 'lbSlideToLeft 0.3s ease forwards'
    : 'lbSlideToRight 0.3s ease forwards';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: C.ink, animation: overlayAnim }}
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute top-6 left-6 pointer-events-none label-text"
        style={{ fontSize: '12px', color: C.white60 }}
      >
        {index + 1} / {images.length}
      </div>

      <button
        className="absolute top-5 right-5 transition-colors duration-300 z-10"
        style={{ color: C.white60 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.white60)}
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        className="absolute left-4 md:left-8 transition-colors duration-300 z-10 p-2"
        style={{ color: C.white45 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.white45)}
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        aria-label="Previous"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {exitingImg && (
        <img
          src={exitingImg.img.src}
          alt={lang === 'hr' ? exitingImg.img.altHr : exitingImg.img.altEn}
          style={{
            position: 'absolute',
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            animation: imgExitAnim,
          }}
        />
      )}

      <img
        key={closing ? `${imgKey}-closing` : imgKey}
        src={img.src}
        alt={lang === 'hr' ? img.altHr : img.altEn}
        style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', animation: imgEnterAnim }}
        onClick={(e) => e.stopPropagation()}
      />

      <button
        className="absolute right-4 md:right-8 transition-colors duration-300 z-10 p-2"
        style={{ color: C.white45 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.white45)}
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        aria-label="Next"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}

/* ─── GalleryItem ───────────────────────────────────────────────────────── */

const galleryObserver =
  typeof window !== 'undefined' && !prefersReducedMotion()
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.dispatchEvent(new CustomEvent('gallery-reveal'));
              galleryObserver.unobserve(entry.target);
            }
          }
        },
        { rootMargin: '200px 0px', threshold: 0.01 }
      )
    : null;

function GalleryItem({
  img,
  index,
  lang,
  onClick,
}: {
  img: (typeof GALLERY_IMAGES)[number];
  index: number;
  lang: Lang;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!galleryObserver) {
      setVisible(true);
      return;
    }
    const onReveal = () => setVisible(true);
    el.addEventListener('gallery-reveal', onReveal);
    galleryObserver.observe(el);
    return () => {
      el.removeEventListener('gallery-reveal', onReveal);
      galleryObserver.unobserve(el);
    };
  }, []);

  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, []);

  const delay = (index % 3) * 90;
  const isAboveFold = index < 6;

  return (
    <div
      ref={ref}
      data-cursor="view"
      className="relative group overflow-hidden cursor-pointer"
      style={{
        aspectRatio: '4/3',
        background: C.bone,
        opacity: visible ? undefined : 0,
        ...(visible && {
          animation: `galleryReveal 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms both`,
        }),
      }}
      onClick={onClick}
    >
      <img
        ref={imgRef}
        src={img.src}
        alt={lang === 'hr' ? img.altHr : img.altEn}
        width={640}
        height={480}
        className="w-full h-full object-cover object-center block transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]"
        style={{
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease, transform 400ms ease-out',
        }}
        loading={isAboveFold ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={isAboveFold ? 'high' : 'low'}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => setImgLoaded(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.08] transition-colors duration-[400ms]" />
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────────────────────── */

function Header() {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const heroHeightRef = useRef(0);

  useEffect(() => {
    const isImpressum = window.location.pathname === '/impressum';
    if (isImpressum) {
      setPastHero(true);
      return;
    }
    const hero = document.querySelector('section');
    heroHeightRef.current = hero ? hero.offsetHeight : window.innerHeight;
    const onScroll = () => setPastHero(window.scrollY > heroHeightRef.current - 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: tx('navPortfolio', lang), href: '#portfolio' },
    { label: tx('navAbout',     lang), href: '#about' },
    { label: tx('navServices',  lang), href: '#services' },
    { label: tx('navContact',   lang), href: '#contact' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: pastHero || menuOpen ? 'rgba(17,17,17,0.72)' : 'transparent',
        backdropFilter: pastHero || menuOpen ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: pastHero || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: '1px solid transparent',
        mixBlendMode: pastHero || menuOpen ? 'normal' : 'difference',
        transition: 'background 0.5s cubic-bezier(0.32,0.72,0,1), backdrop-filter 0.5s cubic-bezier(0.32,0.72,0,1), border-bottom-color 0.5s ease',
      }}
>
      <div className="section-padding flex items-center justify-between h-20">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo(0, 0);
            }
          }}
        >
          <img src="/logo-mate-white.png" alt="Mate Mihaljević" style={{ height: '44px', width: 'auto' }} />
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(l.href.slice(1));
              }}
              className="link-underline label-text transition-colors duration-300"
              style={{ fontSize: '12px', color: C.white }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white60)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.white)}
            >
              {l.label}
            </a>
          ))}

          <button
            onClick={() => setLang(lang === 'hr' ? 'en' : 'hr')}
            className="flex items-center gap-2 label-text transition-colors duration-300"
            style={{ fontSize: '12px', color: C.white60 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.white60)}
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            {lang === 'hr' ? 'EN' : 'HR'}
          </button>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'hr' ? 'en' : 'hr')}
            className="flex items-center gap-1.5 label-text"
            style={{ fontSize: '12px', color: C.white60 }}
          >
            <Globe className="w-4 h-4" />
            {lang === 'hr' ? 'EN' : 'HR'}
          </button>
          <button
            style={{ color: C.white }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="relative w-6 h-6 flex items-center justify-center"
          >
            <span
              className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'rotate(90deg) scale(0.4)' : 'rotate(0deg) scale(1)',
              }}
            >
              <Menu className="w-6 h-6" />
            </span>
            <span
              className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.4)',
              }}
            >
              <X className="w-6 h-6" />
            </span>
          </button>
        </div>
      </div>

      <div
        className="md:hidden absolute top-full left-0 right-0 z-40"
        style={{
          background: 'rgba(17,17,17,0.6)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-20px) scale(0.98)',
          transformOrigin: 'top center',
          pointerEvents: menuOpen ? 'auto' : 'none',
          borderTop: '1px solid rgba(245,240,232,0.08)',
          transition: 'opacity 0.45s cubic-bezier(0.32, 0.72, 0, 1), transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <nav className="flex flex-col items-center gap-7 py-12">
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                scrollToSection(l.href.slice(1));
              }}
              className="label-text"
              style={{
                fontSize: '16px',
                color: C.white,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.4s ease ${100 + i * 70}ms, transform 0.4s ease ${100 + i * 70}ms, color 0.3s ease`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.white60)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.white)}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ─── Hero (stays dark — video provides contrast) ───────────────────────── */

function Hero() {
  const { lang } = useLang();
  const [loaded, setLoaded] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setLoaded(true);
      setSettled(true);
      return;
    }
    const timer = setTimeout(() => setLoaded(true), 100);
    const settle = setTimeout(() => setSettled(true), 1800);
    return () => { clearTimeout(timer); clearTimeout(settle); };
  }, []);

  const anim = (delay: string) =>
    settled ? {} : loaded
      ? { opacity: 1, transition: `opacity 0.8s ease ${delay}` }
      : { opacity: 0 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: '#111111',
        isolation: 'isolate',
      }}
    >
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/Hero_2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={
          settled
            ? undefined
            : { opacity: loaded ? 1 : 0, transition: 'opacity 1.2s ease 0.05s' }
        }
      />

      <div
        className="relative flex flex-col justify-end section-padding"
        style={{ minHeight: '100vh', paddingBottom: '90px', mixBlendMode: 'difference' }}
      >
        <h1 className="hero-name" style={{ ...anim('0.2s') }}>
          MATE MIHALJEVIĆ
        </h1>
        <p className="hero-services" style={{ ...anim('0.4s') }}>
          {tx('heroTagline', lang).toUpperCase()}
        </p>
        <a
          href="#portfolio"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('portfolio');
          }}
          className="hero-cta transition-all duration-300"
          style={{
            ...anim('0.6s'),
            border: `1.5px solid ${C.white}`,
            color: C.white,
            background: 'transparent',
            padding: '14px 32px',
            textDecoration: 'none',
            marginTop: '32px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = C.white;
            (e.currentTarget as HTMLAnchorElement).style.color = C.ink;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = C.white;
          }}
        >
          {tx('heroCta', lang).toUpperCase()}
        </a>

        <a
          href="#portfolio"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('portfolio');
          }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 transition-colors duration-300"
          style={{
            ...anim('0.9s'),
            color: C.white60,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.white)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.white60)}
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

/* ─── Portfolio ─────────────────────────────────────────────────────────── */

function Portfolio() {
  const { lang } = useLang();
  const { ref, visible } = useIntersection();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox  = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length));
  const nextImage = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % GALLERY_IMAGES.length));

  return (
    <section id="portfolio" className="py-36 md:py-52 section-padding" style={{ background: C.bone }}>
      <div ref={ref}>
        <p
          className={`label-text mb-4 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ fontSize: '11px', color: C.ink55 }}
        >
          {tx('portfolioLabel', lang)}
        </p>
        <h2
          className={`font-display fluid-h2 mb-20 ${visible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}
          style={{ color: C.ink, letterSpacing: '0.02em' }}
        >
          {tx('portfolioTitle', lang)}
        </h2>
      </div>

      <div className="masonry-grid">
          {GALLERY_IMAGES.map((img, i) => (
            <GalleryItem
              key={img.src}
              img={img}
              index={i}
              lang={lang}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          index={lightboxIndex}
          lang={lang}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}

/* ─── About ─────────────────────────────────────────────────────────────── */

function About() {
  const { lang } = useLang();
  const { ref, visible } = useIntersection();

  return (
    <section id="about" className="py-36 md:py-52 section-padding" style={{ background: C.bone, borderTop: `1px solid ${C.ink12}` }}>
      <div
        ref={ref}
        className="grid lg:grid-cols-[38%_1fr] gap-12 lg:gap-16 items-center"
      >
        <div
          className={`overflow-hidden mx-auto w-full ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{
            border: '1px solid rgba(17, 17, 17, 0.15)',
            borderRadius: 0,
            aspectRatio: '4 / 5',
            maxWidth: 'min(460px, 50vw)',
            width: '100%',
          }}
        >
          <img
            src="/mate-foto.jpg"
            alt="Mate Mihaljević"
            width={600}
            height={750}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>

        <div className={`flex flex-col justify-center ${visible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          <p
            className="label-text mb-5"
            style={{ fontSize: '11px', color: C.ink55 }}
          >
            {tx('aboutLabel', lang)}
          </p>
          <h2
            className="font-display fluid-h2 mb-3"
            style={{ color: C.ink, letterSpacing: '0.02em' }}
          >
            Mate Mihaljević
          </h2>
          <p
            className="label-text mb-8"
            style={{ fontSize: '13px', color: C.ink }}
          >
            {tx('aboutSubtitle', lang)}
          </p>
          <p
            className="fluid-body max-w-lg"
            style={{ fontWeight: 300, color: C.ink75, lineHeight: 1.7 }}
          >
            {tx('aboutBio', lang)}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Services ──────────────────────────────────────────────────────────── */

function ServiceCard({
  svc,
  visible,
  delay,
  lang,
}: {
  svc: (typeof SERVICES_CFG)[number];
  visible: boolean;
  delay: number;
  lang: Lang;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`p-8 md:p-10 transition-all duration-300 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{
        background: 'transparent',
        border: `1px solid ${hovered ? C.ink : C.ink12}`,
        animationDelay: `${delay}ms`,
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svc.icon className="w-6 h-6 mb-6" style={{ color: C.ink }} />
      <h3
        className="font-display fluid-h4 mb-4"
        style={{ color: C.ink, letterSpacing: '0.02em' }}
      >
        {tx(svc.titleKey, lang)}
      </h3>
      <p className="fluid-body" style={{ fontWeight: 300, color: C.ink75, lineHeight: 1.7 }}>
        {tx(svc.descKey, lang)}
      </p>
    </div>
  );
}

function Services() {
  const { lang } = useLang();
  const { ref, visible } = useIntersection();

  return (
    <section id="services" className="py-36 md:py-52 section-padding" style={{ background: C.bone, borderTop: `1px solid ${C.ink12}` }}>
      <div ref={ref}>
        <p
          className={`label-text mb-4 ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ fontSize: '11px', color: C.ink55 }}
        >
          {tx('servicesLabel', lang)}
        </p>
        <h2
          className={`font-display fluid-h2 mb-20 ${visible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}
          style={{ color: C.ink, letterSpacing: '0.02em' }}
        >
          {tx('servicesTitle', lang)}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES_CFG.map((svc, i) => (
            <ServiceCard
              key={svc.titleKey}
              svc={svc}
              visible={visible}
              delay={i * 150}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ───────────────────────────────────────────────────────────── */

function Contact() {
  const { lang } = useLang();
  const { ref, visible } = useIntersection();
  const [form, setForm] = useState({ name: '', email: '', message: '', project_type: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);

    try {
      const response = await fetch(e.currentTarget.action, {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');

      setForm({ name: '', email: '', message: '', project_type: '' });
      setSent(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: `1px solid ${C.ink12}`,
    color: C.ink,
    padding: '14px 16px',
    fontFamily: "'Archivo', sans-serif",
    fontWeight: 300,
    fontSize: '14px',
    outline: 'none',
    borderRadius: 0,
    transition: 'border-color 0.3s ease',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = C.ink;
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = C.ink12;
  };

  return (
    <section id="contact" className="py-36 md:py-52 section-padding" style={{ background: C.bone, borderTop: `1px solid ${C.ink12}` }}>
      <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
        <div className={visible ? 'animate-fade-in-up' : 'opacity-0'}>
          <p
            className="label-text mb-5"
            style={{ fontSize: '11px', color: C.ink55 }}
          >
            {tx('contactLabel', lang)}
          </p>
          <h2 className="font-display fluid-h2 mb-6" style={{ color: C.ink, letterSpacing: '0.02em', lineHeight: 1.0 }}>
            {tx('contactTitle1', lang)}
            <br />
            <span style={{ color: C.ink45 }}>{tx('contactTitle2', lang)}</span>
          </h2>
          <p className="fluid-body mb-10 max-w-md" style={{ fontWeight: 300, color: C.ink75, lineHeight: 1.7 }}>
            {tx('contactBody', lang)}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3" style={{ fontWeight: 300, fontSize: '14px', color: C.ink75 }}>
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: C.ink }} />
              {tx('contactLocation', lang)}
            </div>
            <div className="flex items-center gap-3" style={{ fontWeight: 300, fontSize: '14px', color: C.ink75 }}>
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: C.ink }} />
              mate.mihaljevic@plenus.hr
            </div>
          </div>
        </div>

        {sent ? (
          <div
            className={`animate-fade-in-up ${visible ? 'delay-200' : 'opacity-0'}`}
            style={{ color: C.ink, paddingTop: '8px' }}
          >
            <p className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '0.01em' }}>
              {tx('msgSent', lang)}
            </p>
          </div>
        ) : (
        <form
          action="https://formspree.io/f/mqeonezq"
          method="POST"
          onSubmit={handleSubmit}
          className={`space-y-4 ${visible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}
        >
          <input type="hidden" name="_replyto" value="mate.mihaljevic@plenus.hr" />
          <input
            type="text"
            name="name"
            placeholder={tx('inputName', lang)}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ ...inputStyle }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <input
            type="email"
            name="email"
            placeholder={tx('inputEmail', lang)}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ ...inputStyle }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <select
            name="project_type"
            value={form.project_type}
            onChange={(e) => setForm({ ...form, project_type: e.target.value })}
            style={{ ...inputStyle, color: form.project_type ? C.ink : C.ink45 }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          >
            <option value="" disabled style={{ color: C.ink45 }}>
              {tx('inputProjectType', lang)}
            </option>
            {PT_KEYS.map((k) => (
              <option key={k} value={tx(k, lang)} style={{ background: C.bone, color: C.ink }}>
                {tx(k, lang)}
              </option>
            ))}
          </select>
          <textarea
            name="message"
            placeholder={tx('inputMessage', lang)}
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-3 label-text transition-all duration-150"
            style={{
              background: 'transparent',
              color: C.ink,
              border: `1.5px solid ${C.ink}`,
              padding: '14px 32px',
              fontSize: '12px',
              borderRadius: 0,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = C.ink;
              (e.currentTarget as HTMLButtonElement).style.color = C.bone;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = C.ink;
            }}
          >
            {submitting ? tx('btnSending', lang) : tx('btnSend', lang)}
            {!submitting && <Send className="w-4 h-4" />}
          </button>

          {submitError && (
            <p className="text-sm animate-fade-in" style={{ color: C.ink65, fontWeight: 300, lineHeight: 1.6 }}>
              {tx('msgError', lang)}
            </p>
          )}
        </form>
        )}
      </div>
    </section>
  );
}

/* ─── Footer (near-black bookend) ────────────────────────────────────────── */

function SocialLink({ href, icon: Icon, label }: { href: string; icon: typeof Instagram; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 label-text transition-colors duration-300 group"
      style={{ fontSize: '12px', color: C.white45 }}
      onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
      onMouseLeave={(e) => (e.currentTarget.style.color = C.white45)}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

function Footer() {
  const { lang } = useLang();

  return (
    <footer className="py-12 section-padding" style={{ background: C.ink, borderTop: `1px solid ${C.ink}` }}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-3">
          <p
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 500,
              fontSize: '12px',
              color: C.white,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Mate Mihaljević Photography
          </p>
          <a
            href="/impressum"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/impressum');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="transition-colors duration-300"
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 400,
              fontSize: '10px',
              color: C.white60,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.white)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.white60)}
          >
            &copy; 2026 Plenus d.o.o. za trgovinu i turizam · OIB: 68616104307 · Igrane, Hrvatska
          </a>
        </div>

        <div className="flex items-center gap-6">
          <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
          <SocialLink href="https://tiktok.com"    icon={Music2}    label="TikTok" />
          <SocialLink href="https://linkedin.com"  icon={Linkedin}  label="LinkedIn" />
        </div>
      </div>
    </footer>
  );
}

/* ─── Impressum page ─────────────────────────────────────────────────────── */

function Impressum() {
  const { lang } = useLang();
  const fields = tx('impressumFields', lang) as unknown as [string, string][];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen" style={{ background: C.bone }}>
      <div className="pt-32 pb-24 section-padding">
        <div className="max-w-2xl mx-auto">
          <p
            className="label-text mb-5 animate-fade-in-up"
            style={{ fontSize: '11px', color: C.ink55 }}
          >
            {tx('impressumSubtitle', lang).toUpperCase()}
          </p>
          <h1
            className="font-display fluid-h2 mb-16 animate-fade-in-up delay-100"
            style={{ color: C.ink, letterSpacing: '0.02em' }}
          >
            {tx('impressumTitle', lang)}
          </h1>

          <dl className="space-y-0 animate-fade-in-up delay-200">
            {fields.map(([label, value], i) => (
              <div
                key={label}
                className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-5"
                style={{
                  borderBottom: `1px solid ${C.ink08}`,
                  ...(i === 0 ? { borderTop: `1px solid ${C.ink08}` } : {}),
                }}
              >
                <dt
                  className="label-text"
                  style={{ fontSize: '11px', color: C.ink55, paddingTop: '2px' }}
                >
                  {label.toUpperCase()}
                </dt>
                <dd
                  className="fluid-body"
                  style={{ fontWeight: 300, color: C.ink, lineHeight: 1.6 }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="inline-flex items-center gap-2 label-text transition-colors duration-300 mt-16 animate-fade-in-up delay-300"
            style={{ fontSize: '12px', color: C.ink }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink55)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.ink)}
          >
            <ArrowLeft className="w-4 h-4" />
            {tx('impressumBack', lang).toUpperCase()}
          </a>
        </div>
      </div>
    </main>
  );
}

/* ─── App ───────────────────────────────────────────────────────────────── */

export default function App() {
  const [lang, setLang] = useState<Lang>('hr');
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const isImpressum = route === '/impressum';

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <div className="min-h-screen">
        <ScrollProgress />
        <CustomCursor />
        <Header />
        {isImpressum ? (
          <Impressum />
        ) : (
          <>
            <Hero />
            <Portfolio />
            <About />
            <Services />
            <Contact />
          </>
        )}
        <Footer />
      </div>
    </LangCtx.Provider>
  );
}
