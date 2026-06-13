import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";
import { LegalPageHeader } from "@/components/legal/legal-page-header";

export const metadata = {
  title: "Реквизиты и правовая информация — Headshots",
  description: "Правовая информация и данные оператора сервиса Headshots.",
};

export default function LegalPage() {
  return (
    <div className="min-h-dvh bg-[#edede7] text-[#11110f]">
      <LegalPageHeader />

      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">Документы / 03</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Реквизиты и правовая информация</h1>
        <p className="mt-5 text-xs uppercase tracking-[0.14em] text-black/40">Обновлено: июнь 2026</p>

        <div className="legal-document mt-14 text-base leading-relaxed text-black/60">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Оператор сервиса</h2>
            <p className="mt-3">
              Сайт принадлежит и управляется <strong className="text-gray-900">Aleksei Media</strong>.
            </p>
            <p className="mt-3">
              Приём платежей и формирование кассовых чеков (54-ФЗ) осуществляет платёжный сервис{" "}
              <strong className="text-gray-900">LavaTop</strong> (lava.top) в качестве платёжного агента —
              реквизиты продавца указаны в чеке, который вы получаете после оплаты.
            </p>
            {/* Продажа идёт через LavaTop как агента, поэтому собственный ИП/ИНН тут не обязателен.
                Если оформишь самозанятость (НПД) или ИП — можешь добавить статус/ИНН сюда. */}
            <ul className="mt-3 list-none space-y-1">
              <li>
                <span className="text-gray-500">Контакт:</span>{" "}
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
              Headshots создаёт профессиональные портреты с помощью искусственного интеллекта на
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
              Приём платежей осуществляется через платёжный сервис{" "}
              <strong className="text-gray-900">LavaTop</strong> (lava.top), который выступает платёжным
              агентом: проводит оплату и возвраты и формирует кассовый чек в соответствии с 54-ФЗ.
              Оператор не хранит данные банковских карт — их обрабатывает платёжный сервис.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Интеллектуальная собственность</h2>
            <p className="mt-3">
              Контент сайта, бренд и программное обеспечение принадлежат Aleksei Media, если не указано иное.
              Сгенерированные портреты принадлежат пользователю, загрузившему исходные фотографии, как описано
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
