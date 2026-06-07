import { BadgeCheck, Clock, Lock, RefreshCcw } from "lucide-react";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const items = [
  {
    icon: Lock,
    title: "Приватность по умолчанию",
    body: "Ваши загрузки и персональная AI-модель автоматически удаляются в течение 30 дней. Мы никогда не используем ваши фото для обучения других моделей.",
  },
  {
    icon: BadgeCheck,
    title: "Результаты принадлежат вам",
    body: "Полные коммерческие права. Используйте хедшоты в LinkedIn, на сайте, в прессе, на визитках — где угодно.",
  },
  {
    icon: RefreshCcw,
    title: "Понравится или вернём деньги",
    body: "Если вы не получите хедшоты, которыми реально хочется пользоваться, мы бесплатно переобучим модель или вернём деньги полностью.",
  },
  {
    icon: Clock,
    title: "Без студии и ожидания",
    body: "Загрузка с телефона. Результат на почте примерно через 20 минут. Без записи и поездок.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Почему нам доверяют"
          title="Ваши фото и деньги — в надёжных руках"
          subtitle="Реальный продукт с понятными правилами, а не чёрный ящик."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, body }, index) => (
            <ScrollReveal key={title} delay={index * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#111827]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-gray-500">{body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
