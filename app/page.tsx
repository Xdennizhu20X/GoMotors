"use client";

import Image from "next/image";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import { useDealer } from "@/contexts/DealerContext";
import Link from "next/link";

export default function DealerHome() {
  const { dealer } = useDealer();

  // Get configuration
  const config = dealer?.configuration;
  const theme = config?.theme;
  const content = config?.content;
  const images = config?.images;
  const hero = content?.hero;

  // Default values
  const dealerName = dealer?.displayName || dealer?.name || "Tu Próximo";
  const dealerDescription = dealer?.description || `Descubre la mejor selección de vehículos`;

  // Get primary color
  const primaryColor = theme?.colors?.primary || dealer?.theme?.primaryColor || dealer?.brandColor || '#1341ee';

  // Hero content
  const heroTitle = hero?.title || `${dealerName} Vehículo`;
  const heroSubtitle = hero?.subtitle || dealer?.brand || "Vehículos Premium";
  const heroDescription = hero?.description || dealerDescription;
  const heroCTAPrimary = hero?.ctaPrimary || "Explorar Catálogo";
  const heroCTASecondary = hero?.ctaSecondary || "Más Información";

  // Hero image
  const heroImage = images?.heroImage || "/carro.png";

  return (
    <main className="relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        ></div>
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: primaryColor }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Content - Takes 7 columns */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 lg:space-y-8 py-12"
            >
              {/* Brand Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border-2 backdrop-blur-sm bg-white/50 dark:bg-neutral-900/50"
                style={{ borderColor: primaryColor + '40' }}
              >
                <span className="relative flex h-3 w-3">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: primaryColor }}
                  ></span>
                  <span
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: primaryColor }}
                  ></span>
                </span>
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                  {heroSubtitle}
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[0.9] tracking-tighter">
                  <span className="block text-foreground mb-3">
                    {heroTitle.split(' ')[0]}
                  </span>
                  <span
                    className="block bg-clip-text text-transparent bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%)`
                    }}
                  >
                    {heroTitle.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-foreground/70 max-w-2xl leading-relaxed"
              >
                {heroDescription}
              </motion.p>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 py-6 max-w-2xl"
              >
                {[
                  { value: "500+", label: "Vehículos" },
                  { value: "98%", label: "Satisfacción" },
                  { value: "24/7", label: "Soporte" }
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div
                      className="text-3xl lg:text-4xl font-black mb-1"
                      style={{ color: primaryColor }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-foreground/60 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  as={Link}
                  href="/vehiculos"
                  size="lg"
                  className="text-white font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  {heroCTAPrimary}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>

                <Button
                  as={Link}
                  href="/financiamiento"
                  size="lg"
                  variant="bordered"
                  className="font-bold text-lg px-10 py-7 rounded-2xl border-2 transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  {heroCTASecondary}
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-6 pt-4"
              >
                {[
                  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Compra Segura" },
                  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Financiamiento" },
                  { icon: "M5 13l4 4L19 7", text: "Garantía" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: primaryColor + '15' }}
                    >
                      <svg className="w-4 h-4" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-foreground/80">{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image - Takes 5 columns */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed opacity-20"
                  style={{ borderColor: primaryColor }}
                ></motion.div>

                {/* Main card */}
                <div className="absolute inset-8 lg:inset-12">
                  <div
                    className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)`
                    }}
                  >
                    {/* Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <Image
                        src={heroImage}
                        alt="Vehículo"
                        width={600}
                        height={400}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>

                    {/* Floating badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 }}
                      className="absolute top-6 right-6 bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-xl backdrop-blur-sm"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-black mb-1" style={{ color: primaryColor }}>
                          {dealer?.brand || "Premium"}
                        </div>
                        <div className="text-xs text-foreground/60 font-semibold uppercase">
                          Oficial
                        </div>
                      </div>
                    </motion.div>

                    {/* Price tag */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 }}
                      className="absolute bottom-6 left-6 bg-white dark:bg-neutral-900 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-foreground/60 font-medium">Desde</span>
                        <span className="text-2xl font-black" style={{ color: primaryColor }}>
                          $15,000
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Decorative elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-3xl opacity-60"
                  style={{ backgroundColor: primaryColor }}
                ></motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl opacity-40"
                  style={{ backgroundColor: primaryColor }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-foreground/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-black mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-base text-foreground/70 max-w-2xl mx-auto">
              Más que un concesionario, somos tu socio en el camino
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                title: "Proceso Rápido",
                description: "Completa tu compra en menos de 48 horas con nuestro proceso optimizado"
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Mejor Financiamiento",
                description: "Planes flexibles adaptados a tu presupuesto con las tasas más competitivas"
              },
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Garantía Extendida",
                description: "Protección total para tu inversión con cobertura completa"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: primaryColor + '15' }}
                >
                  <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contactanos" className="relative py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-black mb-4">
              Contáctanos
            </h2>
            <p className="text-base text-foreground/70 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Visítanos o contáctanos por cualquiera de nuestros canales.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg h-full">
                <h3 className="text-xl font-bold mb-6">Envíanos un mensaje</h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground focus:outline-none transition-colors"
                      style={{
                        // @ts-ignore
                        '--focus-color': primaryColor
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground focus:outline-none transition-colors"
                      onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground focus:outline-none transition-colors"
                      onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Mensaje"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border-2 border-foreground/20 bg-background text-foreground focus:outline-none transition-colors resize-none"
                      onFocus={(e) => e.currentTarget.style.borderColor = primaryColor}
                      onBlur={(e) => e.currentTarget.style.borderColor = ''}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Services & Hours */}
            <div className="lg:col-span-1 space-y-8">
              {/* Services */}
              {dealer?.services && dealer.services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: primaryColor + '15' }}
                    >
                      <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Servicios</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {dealer.services.map((service, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        <span className="text-foreground/80">{service}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Working Hours */}
              {dealer?.workingHours && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: primaryColor + '15' }}
                    >
                      <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Horario de Atención</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(dealer.workingHours).map(([day, hours]) => {
                      const dayNames: Record<string, string> = {
                        monday: 'Lunes',
                        tuesday: 'Martes',
                        wednesday: 'Miércoles',
                        thursday: 'Jueves',
                        friday: 'Viernes',
                        saturday: 'Sábado',
                        sunday: 'Domingo'
                      };
                      return (
                        <div key={day} className="flex justify-between items-center pb-3 border-b border-foreground/10 last:border-0">
                          <span className="font-semibold text-foreground/80">{dayNames[day]}</span>
                          <span className={`${hours === 'closed' ? 'text-red-500' : 'text-foreground/70'} font-medium`}>
                            {hours === 'closed' ? 'Cerrado' : hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Contact Info & Reviews */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: primaryColor + '15' }}
                  >
                    <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Información</h3>
                </div>
                <div className="space-y-4">
                  {dealer?.address && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-sm text-foreground/60 mb-1">Dirección</p>
                        <p className="text-foreground">{dealer.address}</p>
                        {dealer.location && <p className="text-sm text-foreground/70">{dealer.location}</p>}
                      </div>
                    </div>
                  )}
                  {dealer?.phone && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-sm text-foreground/60 mb-1">Teléfono</p>
                        <a href={`tel:${dealer.phone}`} className="text-foreground hover:underline">
                          {dealer.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {dealer?.email && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-sm text-foreground/60 mb-1">Email</p>
                        <a href={`mailto:${dealer.email}`} className="text-foreground hover:underline">
                          {dealer.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {dealer?.website && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <div>
                        <p className="font-semibold text-sm text-foreground/60 mb-1">Sitio Web</p>
                        <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                          {dealer.website.replace('https://', '').replace('http://', '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Reviews */}
              {dealer?.rating && dealer.rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: primaryColor + '15' }}
                    >
                      <svg className="w-6 h-6" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Reseñas</h3>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-black mb-2" style={{ color: primaryColor }}>
                      {dealer.rating.toFixed(1)}
                    </div>
                    <div className="flex gap-1 justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-6 h-6"
                          style={{ color: star <= Math.round(dealer.rating || 0) ? primaryColor : '#D1D5DB' }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-foreground/60 font-medium">
                      Basado en {dealer.reviewsCount || 0} reseñas
                    </p>
                  </div>
                  <p className="text-foreground/70 text-center leading-relaxed">
                    Nuestros clientes nos califican con excelencia. Nos esforzamos por brindar el mejor servicio y atención personalizada.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
