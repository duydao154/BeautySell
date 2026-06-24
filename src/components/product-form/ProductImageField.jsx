import { getProductImageUrl } from '@/utils/storage'

export default function ProductImageField({ product, imageFile, onImageFileChange }) {
  return (
    <div>
      <label htmlFor="image" className="label">
        Image
      </label>
      {product?.image_url && !imageFile && (
        <img
          src={getProductImageUrl(product.image_url)}
          alt={product.name}
          className="mb-3 h-32 w-32 rounded-[var(--radius-sm)] border border-[var(--color-border)] object-cover"
        />
      )}
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={(event) => onImageFileChange(event.target.files?.[0] ?? null)}
        className="file-input"
      />
    </div>
  )
}
