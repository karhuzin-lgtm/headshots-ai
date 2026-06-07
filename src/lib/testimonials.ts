export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  /** Optional avatar in /public. */
  photo?: string;
};

/**
 * Реальные отзывы клиентов.
 * TODO (owner): добавь сюда настоящие отзывы (имя, роль, текст, при желании фото).
 * Пустой массив — секция отзывов на лендинге НЕ показывается (ничего не выдумываем).
 */
export const TESTIMONIALS: Testimonial[] = [];
