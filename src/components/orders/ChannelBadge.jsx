import { useI18n } from '@/i18n/useI18n'

export default function ChannelBadge({ channel }) {
  const { t } = useI18n()
  const isWhatsApp = channel === 'whatsapp'

  return (
    <span className={`badge ${isWhatsApp ? 'badge-channel-whatsapp' : 'badge-channel-facebook'}`}>
      {isWhatsApp ? t('cart.whatsapp') : t('orders.messenger')}
    </span>
  )
}
