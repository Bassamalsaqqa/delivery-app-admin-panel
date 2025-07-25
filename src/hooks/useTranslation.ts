import { useLocale } from '@/context/LocaleContext';

export const useTranslation = () => {
  const { t, language, setLanguage, dir } = useLocale();
  return { t, language, setLanguage, dir };
};