export default function ChannelBadge({ channel }) {
  const isWhatsApp = channel === 'whatsapp'

  return (
    <span className={`badge ${isWhatsApp ? 'badge-channel-whatsapp' : 'badge-channel-facebook'}`}>
      {isWhatsApp ? 'WhatsApp' : 'Messenger'}
    </span>
  )
}
