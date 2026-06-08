import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";

export const metadata = {
  title: "Согласие на обработку биометрических данных — Headshots",
  description:
    "Согласие на обработку персональных данных, в том числе биометрических, по 152-ФЗ: цель, срок хранения, право отзыва.",
};

export default function ConsentPage() {
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
        <h1 className="font-display text-4xl font-normal tracking-tight">
          Согласие на обработку персональных данных, в том числе биометрических
        </h1>
        <p className="mt-3 text-sm text-gray-500">Обновлено: июнь 2026</p>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Оператор</h2>
            <p className="mt-3">
              Оператором персональных данных является <strong className="text-gray-900">Aleksei Media</strong>.
              Обработка данных осуществляется в соответствии с Федеральным законом № 152-ФЗ «О персональных
              данных».
            </p>
            <p className="mt-3">
              Контакт по вопросам обработки данных:{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Какие данные относятся к биометрическим</h2>
            <p className="mt-3">
              Загружаемые вами фотографии лица позволяют установить вашу личность и относятся к{" "}
              <strong className="text-gray-900">биометрическим персональным данным</strong>. Обработка таких
              данных по 152-ФЗ допускается только при наличии вашего письменного согласия.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Цель обработки</h2>
            <p className="mt-3">
              Ваши фотографии обрабатываются исключительно для обучения приватной AI-модели на вашем лице и
              последующей генерации профессиональных портретов по вашему заказу. Модель, обученная на ваших
              фотографиях, не используется для генерации изображений других пользователей.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Добровольность и форма согласия</h2>
            <p className="mt-3">
              Согласие является <strong className="text-gray-900">добровольным и явным</strong>. Вы даёте его
              осознанно, проставляя отметку (галочку) при загрузке фотографий. Без такого согласия загрузка
              фотографий и обработка биометрических данных не производятся, а услуга генерации портретов не
              оказывается.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Срок хранения</h2>
            <p className="mt-3">
              Загруженные фотографии и обученная на вашем лице AI-модель хранятся не более{" "}
              <strong>30 дней</strong> после генерации портретов, после чего удаляются. Вы можете запросить
              досрочное удаление в любой момент.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Право отозвать согласие</h2>
            <p className="mt-3">
              Вы вправе отозвать настоящее согласие в любой момент. Для этого напишите на{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              . После получения отзыва мы прекращаем обработку и удаляем ваши биометрические данные, если для их
              дальнейшего хранения нет иных оснований, предусмотренных законом.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Связанные документы</h2>
            <p className="mt-3">
              <Link href="/privacy" className="font-medium text-[#111827] underline underline-offset-4">
                Политика конфиденциальности
              </Link>
              {" · "}
              <Link href="/terms" className="font-medium text-[#111827] underline underline-offset-4">
                Условия использования
              </Link>
              {" · "}
              <Link href="/legal" className="font-medium text-[#111827] underline underline-offset-4">
                Реквизиты
              </Link>
            </p>
          </section>
        </div>
      </main>

      <LegalPageFooter />
    </div>
  );
}
