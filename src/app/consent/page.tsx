import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";
import { LegalPageHeader } from "@/components/legal/legal-page-header";

export const metadata = {
  title: "Согласие на обработку биометрических данных — Headshots",
  description:
    "Согласие на обработку персональных данных, в том числе биометрических, по 152-ФЗ: цель, срок хранения, право отзыва.",
};

export default function ConsentPage() {
  return (
    <div className="min-h-dvh bg-[#edede7] text-[#11110f]">
      <LegalPageHeader />

      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">Документы / 04</p>
        <h1 className="mt-5 max-w-5xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">
          Согласие на обработку персональных данных, в том числе биометрических
        </h1>
        <p className="mt-5 text-xs uppercase tracking-[0.14em] text-black/40">Обновлено: июнь 2026</p>

        <div className="legal-document mt-14 text-base leading-relaxed text-black/60">
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
