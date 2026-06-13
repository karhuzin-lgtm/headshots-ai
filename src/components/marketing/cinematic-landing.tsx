import {
  ArrowDown,
  ArrowRight,
  Check,
  Download,
  LockKeyhole,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CtaButton } from "@/components/marketing/cta-button";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { BrandMark } from "@/components/site/brand-mark";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { PRIMARY_CTA, TEAM_CTA } from "@/lib/landing-config";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";
import { TIER_ORDER, TIERS, type Tier } from "@/lib/tiers";

const nav = [
  { href: "#results", label: "Результаты" },
  { href: "#process", label: "Процесс" },
  { href: "#styles", label: "Стили" },
  { href: "#pricing", label: "Цена" },
] as const;

const process = [
  {
    number: "01",
    icon: Upload,
    title: "Загрузите селфи",
    body: "8–20 обычных кадров с телефона. Мы подскажем, какие фото дадут лучший результат.",
  },
  {
    number: "02",
    icon: ScanFace,
    title: "Создаём вашу модель",
    body: "ИИ изучает черты лица и собирает персональную визуальную модель только для вашего заказа.",
  },
  {
    number: "03",
    icon: Download,
    title: "Получите галерею",
    body: "Через ~20 минут все портреты появятся в личной галерее и придут на вашу почту.",
  },
] as const;

const trust = [
  {
    icon: LockKeyhole,
    title: "Приватность",
    body: "Фото и персональная AI-модель автоматически удаляются в течение 30 дней.",
  },
  {
    icon: ShieldCheck,
    title: "Права ваши",
    body: "Используйте готовые портреты в работе, рекламе, прессе и социальных сетях.",
  },
  {
    icon: Sparkles,
    title: "Гарантия",
    body: "Бесплатно перегенерируем результат или вернём оплату, если портреты не подойдут.",
  },
] as const;

const faq = [
  {
    question: "Какие фотографии подойдут?",
    answer:
      "Обычные селфи с телефона при хорошем свете. Лучше загрузить 8–20 кадров с разными ракурсами, без сильных фильтров и солнцезащитных очков.",
  },
  {
    question: "Сколько ждать результат?",
    answer:
      "Обычно около 20 минут. Вкладку можно закрыть: мы пришлём письмо, когда персональная галерея будет готова.",
  },
  {
    question: "Можно использовать фото для работы и рекламы?",
    answer:
      "Да. Все права на готовые портреты принадлежат вам. Они подходят для LinkedIn, сайта, резюме, выступлений и коммерческих материалов.",
  },
  {
    question: "Что происходит с загруженными селфи?",
    answer:
      "Исходные фотографии и персональная AI-модель удаляются в течение 30 дней. Мы не используем их для обучения других моделей.",
  },
] as const;

function EditorialLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-[10px] uppercase tracking-[0.32em] ${
        dark ? "text-white/50" : "text-black/45"
      }`}
    >
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  dark = false,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <ScrollReveal className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <EditorialLabel dark={dark}>{eyebrow}</EditorialLabel>
      <h2
        className={`mt-5 text-balance font-display text-[clamp(2.8rem,7vw,7rem)] font-semibold leading-[0.88] tracking-[-0.075em] ${
          dark ? "text-white" : "text-[#11110f]"
        }`}
      >
        {title}
      </h2>
      {body && (
        <p
          className={`mt-7 max-w-2xl text-base font-light leading-7 sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          } ${dark ? "text-white/55" : "text-black/52"}`}
        >
          {body}
        </p>
      )}
    </ScrollReveal>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const tierLabel = {
    basic: "Для старта",
    pro: "Самый популярный",
    premium: "Максимум выбора",
  }[tier.id];

  return (
    <article
      className={`relative flex min-h-[560px] flex-col border p-7 sm:p-8 ${
        tier.popular
          ? "border-white/65 bg-[#f0f0ea] text-[#11110f]"
          : "border-white/12 bg-[#11110f] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p
            className={`font-mono text-[9px] uppercase tracking-[0.25em] ${
              tier.popular ? "text-black/38" : "text-white/35"
            }`}
          >
            {tierLabel}
          </p>
          <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.06em]">{tier.name}</h3>
          <p className={`mt-2 text-sm ${tier.popular ? "text-black/50" : "text-white/45"}`}>{tier.tagline}</p>
        </div>
        <span
          className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] ${
            tier.popular ? "border-black/10 text-black/45" : "border-white/10 text-white/40"
          }`}
        >
          {tier.expectedCount} фото
        </span>
      </div>

      <div className={`mt-8 border-t pt-7 ${tier.popular ? "border-black/10" : "border-white/10"}`}>
        <p className="font-display text-5xl font-semibold leading-none tracking-[-0.08em]">{tier.priceLabel}</p>
        <p
          className={`mt-2 font-mono text-[8px] uppercase tracking-[0.24em] ${
            tier.popular ? "text-black/35" : "text-white/30"
          }`}
        >
          разовый платёж
        </p>
      </div>

      <ul className="mt-8 flex-1 space-y-4">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-start gap-3 text-sm leading-5 ${
              tier.popular ? "text-black/62" : "text-white/55"
            }`}
          >
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.popular ? "text-black" : "text-[#edc894]"}`} />
            {feature}
          </li>
        ))}
      </ul>

      <CtaButton
        href="/try/generate#choose"
        event="pricing_cta_click"
        eventProps={{ location: "pricing", tier: tier.id }}
        variant={tier.popular ? "primary" : "onDarkGhost"}
        fullWidth
        className={`mt-8 min-h-[54px] font-mono text-[10px] uppercase tracking-[0.18em] ${
          tier.popular ? "" : "border-white/18"
        }`}
      >
        Выбрать {tier.name.toLowerCase()}
      </CtaButton>
    </article>
  );
}

export function CinematicLanding() {
  return (
    <div className="overflow-clip bg-[#edede7] text-[#11110f]">
      <section className="relative min-h-[100svh] overflow-hidden bg-[#081018] text-white">
        <Image
          src="/generated/hero-atmosphere.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-atmosphere object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,13,.76)_0%,rgba(4,8,13,.1)_35%,rgba(4,8,13,.28)_68%,rgba(4,8,13,.96)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(2,6,10,.12)_42%,rgba(2,6,10,.78)_100%)]" />
        <div className="site-grain absolute inset-0 opacity-30" />

        <header className="relative z-20 px-4 pt-4 sm:px-7 sm:pt-6">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between">
            <Link href="/" aria-label="Headshots — главная">
              <BrandMark light />
            </Link>
            <nav className="glass-nav hidden items-center rounded-full p-1 md:flex">
              {nav.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-5 py-3 font-mono text-[9px] uppercase tracking-[0.25em] transition hover:bg-white/10 ${
                    index === 0 ? "bg-white text-black hover:bg-white" : "text-white/65"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <CtaButton
              href={PRIMARY_CTA.href}
              event="hero_cta_click"
              eventProps={{ location: "header" }}
              variant="onDarkGhost"
              className="min-h-[42px] border-white/30 bg-black/10 px-5 font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white hover:text-black"
            >
              Начать
            </CtaButton>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-88px)] max-w-[1500px] flex-col px-5 pb-7 pt-16 sm:px-7 sm:pb-9 lg:pt-20">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center text-center">
            <ScrollReveal className="border-y border-white/15 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/62">
                Профессиональные портреты из ваших селфи
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.06} className="mt-8 w-full">
              <h1 className="text-balance font-display text-[clamp(3.2rem,11vw,10.5rem)] font-semibold leading-[0.76] tracking-[-0.095em] text-white">
                Портреты,
                <br />
                <span className="text-white/55">
                  которые <span className="block sm:inline">работают.</span>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.12} className="mt-9 w-full max-w-xl">
              <p className="text-balance text-sm font-light leading-6 text-white/62 sm:text-base">
                Профессиональная фотосессия из обычных селфи. Без студии, фотографа и долгого ожидания.
              </p>
              <CtaButton
                href={PRIMARY_CTA.href}
                event="hero_cta_click"
                eventProps={{ location: "hero" }}
                className="group mt-7 min-h-[56px] gap-4 bg-white px-3 pl-6 font-mono text-[10px] uppercase tracking-[0.2em] text-black hover:bg-[#f2ede3]"
              >
                Создать мои портреты
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CtaButton>
              <p className="mt-5 text-xs font-light text-white/42">
                Без подписки · результат на почту · полные права на фото
              </p>
            </ScrollReveal>
          </div>
        </div>

        <Link
          href="#results"
          aria-label="Перейти к результатам"
          className="absolute bottom-8 right-7 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white/70 backdrop-blur-md transition hover:bg-white hover:text-black lg:flex"
        >
          <ArrowDown className="h-4 w-4" />
        </Link>
      </section>

      <main>
        <section id="results" className="scroll-mt-8 border-t border-black/10 bg-[#edede7] px-5 py-24 sm:px-7 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeading
              eyebrow="01 / До и после"
              title={
                <>
                  Из селфи
                  <br />
                  <span className="text-black/25">в рабочий портрет.</span>
                </>
              }
              body="Один исходник, одна последовательная серия и шесть понятных профессиональных контекстов. Без случайных образов и визуального шума."
            />

            <div className="mt-16 overflow-hidden border border-black/10 bg-[#e4e4de] p-4 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-[0.62fr_1.38fr] lg:gap-8">
                <ScrollReveal className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <EditorialLabel>Исходник</EditorialLabel>
                    <span className="text-xs text-black/38">Фото с телефона</span>
                  </div>
                  <div className="relative mt-4 aspect-[3/4] overflow-hidden border border-black/10 bg-[#d2d2cc]">
                    <Image
                      src={MY_BEFORE_PHOTO}
                      alt="Селфи до обработки"
                      fill
                      sizes="(max-width: 1024px) 100vw, 32vw"
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-black/38">
                    Обычный исходник без студийного света и специальной подготовки.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.06}>
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <EditorialLabel>Готовая серия</EditorialLabel>
                    <span className="text-xs text-black/38">6 профессиональных стилей</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {DISPLAY_STYLES.map((style) => (
                      <article key={style.key}>
                        <div className="relative aspect-[5/6] overflow-hidden border border-black/10 bg-[#c9c9c3] shadow-[0_14px_35px_rgba(17,17,15,0.08)]">
                          <Image
                            src={style.photo}
                            alt={`${style.name} — AI-портрет`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex items-start justify-between gap-3 px-1 pt-3">
                          <div>
                            <h3 className="text-sm font-semibold">{style.name}</h3>
                            <p className="mt-1 hidden text-xs text-black/38 sm:block">{style.tagline}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="scroll-mt-8 bg-[#0a0a09] px-5 py-24 text-white sm:px-7 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeading
              eyebrow="02 / Процесс"
              dark
              title={
                <>
                  Фотосессия без
                  <br />
                  <span className="text-white/28">фотосессии.</span>
                </>
              }
              body="Три спокойных шага между обычным селфи и полноценной профессиональной галереей."
            />

            <div className="mt-20 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">
              {process.map(({ number, icon: Icon, title, body }, index) => (
                <ScrollReveal
                  key={number}
                  delay={index * 0.07}
                  className="relative min-h-[350px] bg-[#0d0d0c] p-7 sm:p-9"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <span className="flex h-11 w-11 items-center justify-center border border-white/12 text-white/75">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30">Шаг {number}</span>
                  </div>
                  <div className="mt-20">
                    <h3 className="font-display text-3xl font-semibold tracking-[-0.055em]">{title}</h3>
                    <p className="mt-4 max-w-sm text-sm font-light leading-6 text-white/45">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="styles" className="scroll-mt-8 bg-[#d7d7d0] px-5 py-24 sm:px-7 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeading
              eyebrow="03 / Коллекция"
              align="center"
              title={
                <>
                  Шесть ролей.
                  <br />
                  <span className="text-black/25">Один человек.</span>
                </>
              }
              body="Образ для каждой профессиональной задачи: от первого касания с рекрутером до интервью в деловом издании."
            />

            <div className="mt-16 flex gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DISPLAY_STYLES.map((style, index) => (
                <ScrollReveal
                  key={style.key}
                  delay={index * 0.04}
                  className="group relative aspect-[5/6] min-w-[82vw] overflow-hidden border border-black/10 bg-black shadow-[0_18px_45px_rgba(17,17,15,0.14)] sm:min-w-[390px] lg:min-w-[420px]"
                >
                  <Image
                    src={style.photo}
                    alt={`${style.name} — стиль портрета`}
                    fill
                    sizes="(max-width: 640px) 82vw, 420px"
                    className="object-contain opacity-90 transition duration-700 group-hover:scale-[1.015] group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <EditorialLabel dark>Коллекция 0{index + 1}</EditorialLabel>
                    <h3 className="mt-3 font-display text-4xl font-semibold tracking-[-0.065em]">{style.name}</h3>
                    <p className="mt-2 max-w-xs text-sm font-light leading-6 text-white/52">{style.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="mt-10 flex justify-center">
              <CtaButton
                href={PRIMARY_CTA.href}
                event="purchase_cta_click"
                eventProps={{ location: "styles" }}
                className="group min-h-[56px] gap-4 px-3 pl-6 font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                Создать свою коллекцию
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CtaButton>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[#edede7] px-5 py-24 sm:px-7 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
              <ScrollReveal className="relative min-h-[650px] overflow-hidden border border-white/10 bg-[#0b1117] text-white">
                <Image
                  src="/my/executive.jpg"
                  alt="Профессиональный AI-портрет"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain object-right opacity-60"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,11,.98)_0%,rgba(5,8,11,.9)_46%,rgba(5,8,11,.16)_100%)]" />
                <div className="site-grain absolute inset-0 opacity-20" />
                <div className="relative flex min-h-[650px] max-w-2xl flex-col justify-between p-7 sm:p-12">
                  <div>
                    <EditorialLabel dark>04 / Почему Headshots</EditorialLabel>
                    <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.08em]">
                      Сильный образ
                      <br />
                      <span className="text-white/32">без лишнего.</span>
                    </h2>
                  </div>
                  <p className="max-w-md text-base font-light leading-7 text-white/55">
                    Портрет перестаёт быть формальностью и начинает работать на доверие ещё до первого разговора.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid gap-5">
                {trust.map(({ icon: Icon, title, body }, index) => (
                  <ScrollReveal
                    key={title}
                    delay={index * 0.06}
                    className="flex min-h-[205px] flex-col justify-between border border-black/[0.07] bg-[#e3e3dd] p-7 sm:p-8"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center border border-black/10">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/25">0{index + 1}</span>
                    </div>
                    <div className="mt-8">
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">{title}</h3>
                      <p className="mt-2 max-w-sm text-sm font-light leading-6 text-black/50">{body}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-8 bg-[#0a0a09] px-5 py-24 text-white sm:px-7 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <SectionHeading
              eyebrow="05 / Цена"
              dark
              align="center"
              title={
                <>
                  Три набора.
                  <br />
                  <span className="text-white/28">Без подписки.</span>
                </>
              }
              body="Выберите объём и качество под свою задачу. У каждого набора свои условия и фиксированная разовая цена."
            />

            <ScrollReveal className="mt-16">
              <div className="grid gap-4 lg:grid-cols-3">
                {TIER_ORDER.map((tierId) => (
                  <TierCard key={tierId} tier={TIERS[tierId]} />
                ))}
              </div>
              <p className="mt-7 text-center text-xs font-light text-white/35">
                Все наборы включают коммерческие права и удаление исходных фото в течение 30 дней.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section id="teams" className="scroll-mt-8 bg-[#d7d7d0] px-5 py-24 sm:px-7 sm:py-32">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[1fr_.9fr] lg:items-end">
              <SectionHeading
                eyebrow="06 / Для команд"
                title={
                  <>
                    Одно впечатление.
                    <br />
                    <span className="text-black/25">Вся команда.</span>
                  </>
                }
                body="Согласованный визуальный образ для сайта, презентаций и профилей сотрудников. Полностью удалённо."
              />
              <ScrollReveal delay={0.08} className="lg:pb-2">
                <div className="space-y-3 border-y border-black/10 py-6">
                  {[
                    "Каждый загружает свои селфи",
                    "Единый стиль для всей команды",
                    "Один счёт и цена за объём",
                  ].map((item) => (
                    <p key={item} className="flex items-center gap-3 text-sm text-black/58">
                      <Check className="h-4 w-4" />
                      {item}
                    </p>
                  ))}
                </div>
                <CtaButton
                  href={TEAM_CTA.href}
                  event="team_cta_click"
                  eventProps={{ location: "teams" }}
                  className="mt-7 min-h-[54px] gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.18em]"
                >
                  Рассчитать для команды
                  <ArrowRight className="h-4 w-4" />
                </CtaButton>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-8 bg-[#edede7] px-5 py-24 sm:px-7 sm:py-32">
          <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[.75fr_1.25fr]">
            <SectionHeading
              eyebrow="07 / Вопросы"
              title={
                <>
                  Всё,
                  <br />
                  <span className="text-black/25">что важно.</span>
                </>
              }
            />
            <ScrollReveal className="divide-y divide-black/10 border-y border-black/10">
              {faq.map((item, index) => (
                <details key={item.question} className="group py-2">
                  <summary className="flex cursor-pointer list-none items-center gap-5 py-6">
                    <span className="font-mono text-[9px] tracking-[0.22em] text-black/25">0{index + 1}</span>
                    <span className="flex-1 font-display text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                      {item.question}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center border border-black/10 text-lg font-light transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 pl-11 pr-12 text-sm font-light leading-7 text-black/50">{item.answer}</p>
                </details>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#071018] px-5 py-28 text-white sm:px-7 sm:py-40">
          <Image
            src="/generated/hero-atmosphere.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,12,.55),rgba(4,8,12,.95))]" />
          <div className="site-grain absolute inset-0 opacity-25" />
          <ScrollReveal className="relative mx-auto max-w-5xl text-center">
            <EditorialLabel dark>Ваша очередь</EditorialLabel>
            <h2 className="mt-7 text-balance font-display text-[clamp(4rem,11vw,10rem)] font-semibold leading-[0.78] tracking-[-0.095em]">
              Покажите себя
              <br />
              <span className="text-white/35">сильнее.</span>
            </h2>
            <CtaButton
              href={PRIMARY_CTA.href}
              event="checkout_start"
              eventProps={{ location: "final" }}
              variant="onDark"
              className="mt-10 min-h-[58px] gap-4 px-7 font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              Создать мои портреты
              <ArrowRight className="h-4 w-4" />
            </CtaButton>
          </ScrollReveal>
        </section>
      </main>

      <footer className="bg-[#090909] px-5 py-10 text-white sm:px-7">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-10 border-t border-white/10 pt-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BrandMark light />
            <p className="mt-5 max-w-xs text-xs font-light leading-5 text-white/35">
              Профессиональные AI-портреты из ваших селфи.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
            <Link href="/privacy" className="transition hover:text-white">
              Конфиденциальность
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Условия
            </Link>
            <Link href="/legal" className="transition hover:text-white">
              Реквизиты
            </Link>
            <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-white">
              Контакт
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1500px] items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-white/22">
          <span>Headshots © 2026</span>
          <span>AI portrait studio</span>
        </div>
      </footer>
    </div>
  );
}
