import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";

export const metadata = {
  title: "Реквизиты и правовая информация — Headshots",
  description: "Правовая информация и данные оператора сервиса Headshots.",
};

export default function LegalPage() {
  return (
    <div className="min-h-dvh bg-white text-[#111827]">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Headshots
          </Link>
          <Link href="/" className="text-sm text-gray-500 transition hover:text-gray-900">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-normal tracking-tight">Реквизиты и правовая информация</h1>
        <p className="mt-3 text-sm text-gray-500">Обновлено: июнь 2026</p>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Оператор сервиса</h2>
            <p className="mt-3">
              Сайт принадлежит и управляется <strong className="text-gray-900">Aleksei Media</strong>.
            </p>
            {/* TODO: укажите реальные реквизиты — форму (ИП / ООО / самозанятый), ФИО/название, ИНН, ОГРН/ОГРНИП, адрес. */}
            <ul className="mt-3 list-none space-y-1">
              <li>
                <span className="text-gray-500">Форма деятельности:</span>{" "}
                <span className="text-gray-900">ИП / самозанятый — указать</span>
              </li>
              <li>
                <span className="text-gray-500">ИНН:</span>{" "}
                <span className="text-gray-900">— указать</span>
              </li>
              <li>
                <span className="text-gray-500">Email:</span>{" "}
                <a
                  href="mailto:aleksei@alekseimedia.com"
                  className="font-medium text-[#111827] underline underline-offset-4"
                >
                  aleksei@alekseimedia.com
                </a>
              </li>
              <li>
                <span className="text-gray-500">Сайт:</span>{" "}
                <a
                  href="https://headshots.alekseimedia.com"
                  className="font-medium text-[#111827] underline underline-offset-4"
                >
                  headshots.alekseimedia.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Назначение сервиса</h2>
            <p className="mt-3">
              Headshots создаёт профессиональные портреты (хедшоты) с помощью искусственного интеллекта на
              основе загруженных пользователем селфи. Условия и стоимость могут изменяться — актуальные
              указаны на сайте на момент заказа.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Применимое право</h2>
            <p className="mt-3">
              Отношения регулируются законодательством Российской Федерации, включая Закон РФ «О защите прав
              потребителей» и Федеральный закон № 152-ФЗ «О персональных данных». Порядок обработки данных —
              в{" "}
              <Link href="/privacy" className="font-medium text-[#111827] underline underline-offset-4">
                Политике конфиденциальности
              </Link>
              . Условия использования —{" "}
              <Link href="/terms" className="font-medium text-[#111827] underline underline-offset-4">
                здесь
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Оплата</h2>
            <p className="mt-3">
              Приём платежей осуществляется через платёжный сервис <strong className="text-gray-900">LavaTop</strong>{" "}
              (lava.top). Оператор не хранит данные банковских карт — их обрабатывает платёжный сервис.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Интеллектуальная собственность</h2>
            <p className="mt-3">
              Контент сайта, бренд и программное обеспечение принадлежат Aleksei Media, если не указано иное.
              Сгенерированные хедшоты принадлежат пользователю, загрузившему исходные фотографии, как описано
              в Условиях использования.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Решение споров</h2>
            <p className="mt-3">
              Мы просим сначала связаться с нами по адресу{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>{" "}
              — большинство вопросов решается напрямую и быстро. Неурегулированные споры рассматриваются в
              порядке, установленном законодательством РФ.
            </p>
          </section>
        </div>
      </main>

      <LegalPageFooter />
    </div>
  );
}
