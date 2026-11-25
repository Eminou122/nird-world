import { Accessibility, Code, Database, Info, Landmark, Recycle, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '../../../components/navigation/Breadcrumbs'
import { buttonClass } from '../../../components/ui/buttonClass'
import { institutionTypes } from '../data/questions'
import { loadStatus, isPersisted } from '../hooks/useDiagnosticStore'
import type { Assessment, BandId, DimensionId, Priority } from '../types/diagnostic'

export const dimensionIcons: Record<DimensionId, LucideIcon> = {
  'logiciels-libres': Code,
  'souverainete-donnees': Database,
  'durabilite-materielle': Recycle,
  accessibilite: Accessibility,
  gouvernance: Landmark,
}

/** Warm-to-green scale; text labels always accompany the colour. */
export const bandColors: Record<BandId, string> = {
  'tres-faible': '#b0523a',
  fragile: '#c98a3c',
  'en-developpement': '#d6a85f',
  avance: '#2f8c6a',
  exemplaire: '#1f6249',
}

export const priorityStyles: Record<Priority, { label: string; className: string }> = {
  haute: { label: 'Priorité haute', className: 'bg-[#b0523a]/12 text-[#8a3622] ring-[#b0523a]/30' },
  moyenne: { label: 'Priorité moyenne', className: 'bg-gold-400/20 text-gold-700 ring-gold-400/50' },
  basse: { label: 'Priorité basse', className: 'bg-emerald-600/10 text-emerald-700 ring-emerald-600/25' },
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' })
const dateTimeFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
export const formatDate = (iso: string) => dateFormat.format(new Date(iso))
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso))

/** French plural: 0 and 1 take the singular. */
export const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`

export const institutionLabel = (assessment: Assessment) => assessment.institutionName || 'Établissement sans nom'
export const institutionTypeLabel = (assessment: Assessment) =>
  assessment.institutionType ? institutionTypes[assessment.institutionType] : null

export function DiagnosticHeader({ crumbs, title, children }: { crumbs: Crumb[]; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="bg-sage-100">
      <div className="mx-auto max-w-5xl px-5 pt-8 pb-10 sm:px-8">
        <div className="print:hidden">
          <Breadcrumbs items={crumbs} />
        </div>
        <h1 className="mt-5 text-4xl leading-tight font-medium text-forest-900 sm:text-5xl">{title}</h1>
        {children}
      </div>
    </section>
  )
}

/** Native <dialog>: focus trap, Escape and backdrop come from the browser. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  danger = false,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl bg-ivory-50 p-0 text-ink shadow-lift backdrop:bg-forest-950/60"
    >
      <div className="p-6 sm:p-7">
        <h2 id={titleId} className="text-2xl font-medium text-forest-900">
          {title}
        </h2>
        <div className="mt-3 leading-relaxed text-ink-muted">{children}</div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={buttonClass('outline-dark')}>
            Annuler
          </button>
          <button type="button" onClick={onConfirm} className={buttonClass(danger ? 'danger' : 'dark')}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

/** Warns when stored data had to be set aside, or when the browser blocks LocalStorage. */
export function StorageNotice() {
  const messages: string[] = []
  if (loadStatus === 'recovered')
    messages.push(
      'Certaines données enregistrées sur cet appareil n’ont pas pu être lues. Elles ont été mises de côté, et vos diagnostics valides sont toujours là.',
    )
  if (!isPersisted())
    messages.push(
      'Votre navigateur refuse l’enregistrement : gardez cette page ouverte jusqu’à la fin, sinon vos réponses seront perdues.',
    )
  if (messages.length === 0) return null
  return (
    <div role="status" className="flex gap-3 rounded-xl bg-gold-400/15 p-4 text-sm leading-relaxed text-forest-900 ring-1 ring-gold-400/40">
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold-700" />
      <div className="space-y-1">
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    </div>
  )
}
