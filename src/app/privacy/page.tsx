import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";
import { LegalPageHeader } from "@/components/legal/legal-page-header";

export const metadata = {
  title: "Политика конфиденциальности — Headshots",
  description: "Как Headshots собирает, использует и защищает ваши данные по 152-ФЗ.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#edede7] text-[#11110f]">
      <LegalPageHeader />

      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">Документы / 01</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Политика конфиденциальности</h1>
        <p className="mt-5 text-xs uppercase tracking-[0.14em] text-black/40">Обновлено: июнь 2026</p>

        <div className="legal-document mt-14 text-base leading-relaxed text-black/60">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Кто мы</h2>
            <p className="mt-3">
              Сервис Headshots управляется <strong className="text-gray-900">Aleksei Media</strong>. Мы являемся
              оператором персональных данных, собираемых через этот сайт, и обрабатываем их в соответствии с
              Федеральным законом № 152-ФЗ «О персональных данных».
            </p>
            <p className="mt-3">
              Запросы по данным:{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Какие данные мы собираем</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Адрес электронной почты — для отправки результата и уведомлений о заказе</li>
              <li>Загруженные фотографии (обычно 8–20 селфи) — для генерации портретов</li>
              <li>Технические данные, необходимые для работы сервиса (например, cookie сессии)</li>
            </ul>
            <p className="mt-3">
              Фотографии лица относятся к биометрическим персональным данным. Мы обрабатываем их только при
              наличии вашего явного согласия, которое вы даёте при загрузке фотографий.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Правовые основания обработки</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-gray-900">Обработка фотографий и генерация:</strong> ваше явное согласие
                до загрузки
              </li>
              <li>
                <strong className="text-gray-900">Письма о статусе заказа</strong> (например, «результат готов»):
                необходимы для оказания заказанной услуги
              </li>
              <li>
                <strong className="text-gray-900">Необходимые cookie:</strong> для безопасной работы сайта
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Как мы используем данные</h2>
            <p className="mt-3">
              Ваши фотографии используются для обучения приватной AI-модели на вашем лице и генерации
              профессиональных портретов. Мы не используем ваши фотографии для обучения моделей других
              пользователей. Мы не продаём ваши персональные данные.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Привлекаемые сервисы</h2>
            <p className="mt-3">
              Для работы сервиса мы используем надёжных подрядчиков, которые обрабатывают данные только по
              нашему поручению:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Vercel — хостинг и хранение файлов</li>
              <li>Neon — база данных</li>
              <li>Resend — отправка писем</li>
              <li>Astria — обучение AI-модели и генерация изображений</li>
              <li>LavaTop — приём платежей и формирование чеков (платёжный агент)</li>
            </ul>
            <p className="mt-3">
              Часть подрядчиков может обрабатывать данные за пределами РФ. Мы стремимся ограничивать передаваемые
              данные тем, что необходимо для оказания услуги.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Сроки хранения</h2>
            <p className="mt-3">
              Загруженные фотографии и обученная на вашем лице AI-модель хранятся не более{" "}
              <strong>30 дней</strong> после генерации, затем удаляются. Вы можете запросить досрочное удаление
              в любой момент.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Ваши права</h2>
            <p className="mt-3">В соответствии с 152-ФЗ вы вправе:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Получать сведения об обработке ваших данных</li>
              <li>Требовать уточнения, блокирования или удаления данных</li>
              <li>Отозвать согласие на обработку в любой момент</li>
              <li>Обжаловать действия оператора в уполномоченном органе</li>
            </ul>
            <p className="mt-3">
              Уполномоченный орган по защите прав субъектов персональных данных в РФ —{" "}
              <strong className="text-gray-900">Роскомнадзор</strong> (
              <a
                href="https://rkn.gov.ru"
                className="font-medium text-[#111827] underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                rkn.gov.ru
              </a>
              ).
            </p>
            <p className="mt-3">
              Чтобы воспользоваться правами, напишите на{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              . Мы отвечаем в сроки, установленные законом.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-lg font-semibold text-[#111827]">Cookie</h2>
            <p className="mt-3">
              Мы используем <strong>только необходимые cookie</strong> — те, что требуются для работы сайта
              (сессия и безопасность). Мы не используем рекламные и аналитические трекинговые cookie.
            </p>
            <p className="mt-3">
              Вы можете управлять cookie в настройках браузера. Блокировка необходимых cookie может нарушить
              работу части функций.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Дети</h2>
            <p className="mt-3">
              Сервис не предназначен для лиц младше 18 лет. Мы сознательно не собираем данные несовершеннолетних.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Изменения</h2>
            <p className="mt-3">
              Мы можем периодически обновлять эту политику. Дата «Обновлено» вверху отражает актуальную версию.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Связанные документы</h2>
            <p className="mt-3">
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
