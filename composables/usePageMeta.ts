import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'

export function usePageMeta(pageKey: string) {
  const { t } = useI18n()

  useHead({
    title: t(`pages.${pageKey}.title`),
    meta: [{ name: 'description', content: t(`pages.${pageKey}.description`) }]
  })
}
