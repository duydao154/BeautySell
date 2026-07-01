import { useI18n } from '@/i18n/useI18n'

export default function ConfirmModal({
  open,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  confirming = false,
}) {
  const { t } = useI18n()

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={confirming}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={confirming}>
            {confirming ? t('common.saving') : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
