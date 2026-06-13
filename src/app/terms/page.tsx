import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";
import { LegalPageHeader } from "@/components/legal/legal-page-header";
import { HEADSHOT_COUNT, PRICE_LABEL, STYLE_COUNT } from "@/lib/landing-config";

export const metadata = {
  title: "Условия использования — Headshots",
  description: "Условия использования сервиса генерации профессиональных портретов Headshots.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#edede7] text-[#11110f]">
      <LegalPageHeader />

      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">Документы / 02</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Условия использования</h1>
        <p className="mt-5 text-xs uppercase tracking-[0.14em] text-black/40">Обновлено: июнь 2026</p>

        <div className="legal-document mt-14 text-base leading-relaxed text-black/60">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Публичная оферта</h2>
            <p className="mt-3">
              Настоящие условия являются публичной офертой. Оплачивая заказ, вы подтверждаете, что
              ознакомились с условиями и принимаете их в полном объёме.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Сервис</h2>
            <p className="mt-3">
              Headshots создаёт профессиональные портреты с помощью искусственного интеллекта на основе
              загруженных вами фотографий. Мы постоянно улучшаем продукт, поэтому отдельные функции могут
              изменяться.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Ваши фотографии</h2>
            <p className="mt-3">
              Загружать можно только собственные фотографии (или фотографии человека, которого вы вправе
              представлять). Запрещено загружать лица третьих лиц без их явного согласия. Вы отвечаете за
              наличие прав на загружаемые изображения.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Права на результат</h2>
            <p className="mt-3">
              Сгенерированные портреты на 100% принадлежат вам. Вы можете использовать их в LinkedIn, на сайтах,
              визитках, в прессе и в любых других личных и коммерческих целях.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Возраст</h2>
            <p className="mt-3">Для использования сервиса вам должно быть не менее 18 лет.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Стоимость и оплата</h2>
            <p className="mt-3">
              Стоимость одного заказа — {PRICE_LABEL} (разовый платёж). В заказ входят {HEADSHOT_COUNT}{" "}
              фотографий в {STYLE_COUNT} профессиональных стилях. Полная стоимость и состав заказа отображаются
              до оплаты. Оплата проходит через платёжный сервис LavaTop; данные карты обрабатывает платёжный
              сервис, оператор их не хранит. Цена для команд рассчитывается отдельно.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Начало оказания услуги</h2>
            <p className="mt-3">
              Услуга является цифровой. Оплачивая заказ и давая согласие на обработку фотографий, вы соглашаетесь
              с тем, что оказание услуги (обучение модели и генерация) начинается сразу после оплаты.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Возврат средств</h2>
            <p className="mt-3">
              Мы хотим, чтобы результат вам подошёл. Если вы не получили портреты, которыми реально хочется
              пользоваться, напишите нам — мы бесплатно переобучим модель или вернём оплату полностью. Возврат
              осуществляется тем же способом, которым была произведена оплата.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Допустимое использование</h2>
            <p className="mt-3">
              Запрещено использовать сервис в незаконных целях, для выдачи себя за другое лицо, создания
              дипфейков без согласия и иного контента, нарушающего закон. Мы вправе приостановить доступ при
              злоупотреблениях.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Отказ от гарантий</h2>
            <p className="mt-3">
              Сервис предоставляется «как есть». Мы стремимся к высокому качеству, но не гарантируем конкретный
              эстетический результат — результат генерации зависит от загруженных вами фотографий.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Применимое право</h2>
            <p className="mt-3">
              Условия регулируются законодательством Российской Федерации. Реквизиты оператора и порядок
              решения споров — в{" "}
              <Link href="/legal" className="font-medium text-[#111827] underline underline-offset-4">
                разделе «Реквизиты»
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Конфиденциальность</h2>
            <p className="mt-3">
              Как мы обрабатываем персональные данные, включая фотографии лица, описано в{" "}
              <Link href="/privacy" className="font-medium text-[#111827] underline underline-offset-4">
                Политике конфиденциальности
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Контакты</h2>
            <p className="mt-3">
              Вопросы по условиям? Напишите на{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <LegalPageFooter />
    </div>
  );
}
