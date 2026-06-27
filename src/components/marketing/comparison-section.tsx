import { Check } from "lucide-react";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { PRICE_LABEL } from "@/lib/landing-config";

const rows = [
  ["Стоимость", "от 5 000 ₽", `от ${PRICE_LABEL} за набор`],
  ["Время", "1–2 недели", "~20 минут"],
  ["Запись", "Нужна", "Не нужна"],
  ["Стили", "Обычно один образ", "6 профессиональных стилей"],
  ["Место", "Поездка в студию", "Откуда угодно"],
] as const;

export function ComparisonSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          title="Зачем фотограф?"
          subtitle="Студийная съёмка — это здорово, когда есть время, бюджет и студия рядом."
        />
        <ScrollReveal className="mt-12 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#faf8f5]">
                  <th className="px-6 py-4 font-medium text-gray-500"> </th>
                  <th className="px-6 py-4 font-medium text-gray-500">Фотограф</th>
                  <th className="px-6 py-4 font-semibold text-[#111827]">Headshots AI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([feature, traditional, ai], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-6 py-4 font-medium text-gray-900">{feature}</td>
                    <td className="px-6 py-4 text-gray-500">{traditional}</td>
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#c9a96e]" />
                        {ai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-gray-100 md:hidden">
            {rows.map(([feature, traditional, ai]) => (
              <div key={feature} className="p-5">
                <p className="font-semibold text-gray-900">{feature}</p>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Фотограф</p>
                    <p className="mt-1 text-gray-600">{traditional}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Headshots AI</p>
                    <p className="mt-1 inline-flex items-center gap-1 font-medium text-gray-900">
                      <Check className="h-4 w-4 text-[#c9a96e]" />
                      {ai}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
