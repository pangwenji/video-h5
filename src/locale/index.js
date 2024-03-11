import { createI18n } from 'vue-i18n';
import ZH from '@/language/zh.js';
import EN from '@/language/en.js';
const messages = {
  zh: { ...ZH  },
  en: { ...EN  },
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  messages
});
export default i18n;
