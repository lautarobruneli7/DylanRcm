// ==================== CONTENIDO INICIAL ====================
// Se usa solo la primera vez (base vacía). Después todo se edita desde /admin.
// Los datos salen de DylanRcm.docx. Las imágenes se copian desde /seed-assets.

export const seedContent = {
  version: 1,
  settings: {
    siteTitle: "Dylan RCM | FPL & UCL Fantasy Tips",
    metaDescription:
      "Reseñas de Gameweek, selecciones de equipos, Wildcards, Free Hits y estrategias para FPL y UCL Fantasy con Dylan RCM.",
    accent: "#e3241d",
    shareImage: "/uploads/banner.jpg",
  },
  general: {
    name: "Dylan RCM",
    role: "FPL & UCL Fantasy Tips",
    avatar: "/uploads/profile.jpg",
    banner: "/uploads/banner.jpg",
    intro: "El hogar de FPL y UCL Fantasy Tips",
    bio: "Cubro ambos formatos de Fantasy con reseñas de Gameweek, selecciones de equipos y transmisiones interactivas. También califico tus equipos y te muestro los mejores Wildcards, Free Hits, transferencias y estrategias de fichas para ayudarte a mejorar tu clasificación.",
    ctaLabel: "Suscribirme en YouTube",
    ctaUrl: "https://www.youtube.com/c/dylanrcm1?sub_confirmation=1",
    secondaryCtaLabel: "Ver videos",
    secondaryCtaUrl: "#videos",
    highlights: [
      { id: "h1", label: "Reseñas de Gameweek", value: "Cada semana", visible: true },
      { id: "h2", label: "Formatos", value: "FPL + UCL Fantasy", visible: true },
      { id: "h3", label: "Transmisiones", value: "En vivo e interactivas", visible: true },
    ],
    links: [
      { id: "l1", label: "Hacete miembro del canal", url: "https://www.youtube.com/c/dylanrcm1/join", visible: false },
      { id: "l2", label: "Sumate al Patreon", url: "https://www.patreon.com/DylanRCM", visible: true },
    ],
  },
  sections: {
    about: { title: "Quién es Dylan", subtitle: "", visible: true },
    news: { title: "Novedades", subtitle: "Lo último del canal y de la comunidad.", visible: true },
    videos: { title: "Videos", subtitle: "Reseñas, selecciones y análisis para tu Fantasy.", visible: true },
    contacts: { title: "Seguime y escribime", subtitle: "Redes, comunidad y contacto profesional.", visible: true },
  },
  news: [
    {
      id: "n1",
      title: "Bienvenido a la nueva web",
      description:
        "Acá voy a ir publicando novedades del canal, nuevos videos y todo lo que pasa en la comunidad de FPL y UCL Fantasy.",
      image: "",
      date: "2026-10-04",
      url: "",
      featured: true,
      visible: true,
    },
  ],
  videos: [],
  contacts: [
    { id: "c1", name: "YouTube", url: "https://www.youtube.com/@FPLDylan", icon: "youtube", text: "Canal principal", visible: true },
    { id: "c2", name: "Instagram", url: "https://instagram.com/dylanrcm", icon: "instagram", text: "@dylanrcm", visible: true },
    { id: "c3", name: "X (Twitter)", url: "https://twitter.com/DylanRCM", icon: "x", text: "@DylanRCM", visible: true },
    { id: "c4", name: "Discord", url: "https://discord.gg/HaAEkSRmeJ", icon: "discord", text: "Unite al servidor", visible: true },
    { id: "c5", name: "Patreon", url: "https://www.patreon.com/DylanRCM", icon: "patreon", text: "Contenido exclusivo", visible: true },
    { id: "c6", name: "Linktree", url: "https://linktr.ee/FPLDylan", icon: "link", text: "Todos mis links", visible: true },
    { id: "c7", name: "Email", url: "mailto:dylancentral@hotmail.co.uk", icon: "mail", text: "dylancentral@hotmail.co.uk", visible: true },
  ],
};
