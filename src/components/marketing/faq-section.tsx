"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionIntro } from "@/components/marketing/section-intro";
import { HEADSHOT_COUNT, PRICE_LABEL, STYLE_COUNT } from "@/lib/landing-config";

const faqItems = [
  {
    q: "Сколько нужно фотографий?",
    a: "Лучше всего 8–20 обычных селфи. Лицо хорошо видно, хороший свет, разные ракурсы. Фото с телефона — идеально.",
  },
  {
    q: "Сколько это занимает?",
    a: "Примерно 20 минут от загрузки до готового результата. Мы пришлём письмо — держать вкладку открытой не нужно.",
  },
  {
    q: "Мои фото где-то хранятся?",
    a: "Нет. Загрузки и ваша персональная модель автоматически удаляются через 30 дней. Мы никогда не обучаем на ваших данных другие модели.",
  },
  {
    q: "Можно использовать портреты в коммерческих целях?",
    a: "Да. Результаты принадлежат вам — LinkedIn, сайт, пресса, визитки, где угодно.",
  },
  {
    q: "А если мне не понравится результат?",
    a: "Если вы не получите портреты, которыми реально хочется пользоваться, мы бесплатно переобучим модель или вернём деньги полностью.",
  },
  {
    q: "Что именно я получаю и сколько это стоит?",
    a: `Единая цена ${PRICE_LABEL} — набор из ${HEADSHOT_COUNT} фотографий в высоком разрешении во всех ${STYLE_COUNT} стилях, на почту. Без подписки и скрытых списаний. Для команд — цена за объём.`,
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <SectionIntro title="Вопросы" subtitle="Короткие ответы перед стартом." />
        <Accordion type="single" collapsible className="mt-12">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base text-[#111827]">{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
