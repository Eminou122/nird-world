import { Trash } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ButtonLink } from '../../../components/ui/ButtonLink'
import { buttonClass } from '../../../components/ui/buttonClass'
import { BuildingIllustration } from '../../village/BuildingIllustration'
import {
  ConfirmDialog,
  DiagnosticHeader,
  StorageNotice,
  bandColors,
  formatDate,
  formatDateTime,
  institutionLabel,
  institutionTypeLabel,
} from '../components/ui'
import { bandLines } from '../data/guidance'
import { questions } from '../data/questions'
import { computeResult } from '../engine/scoring'
import { diagnosticActions, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import { diagnosticPaths } from '../paths'
import type { Assessment } from '../types/diagnostic'

export function HistoryPage() {
  const store = useDiagnosticStore()
  const navigate = useNavigate()
  const [toDelete, setToDelete] = useState<Assessment | null>(null)

  const sorted = [...store.assessments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  function resume(id: string) {
    diagnosticActions.open(id)
    navigate(diagnosticPaths.questionnaire)
  }

  return (
    <>
      <title>Mes diagnostics — NIRD WORLD</title>
      <DiagnosticHeader
        crumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Le village', to: '/village' },
          { label: 'École', to: diagnosticPaths.intro },
          { label: 'Mes diagnostics' },
        ]}
        title="Mes diagnostics"
      >
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-ink-muted">Ils sont enregistrés dans ce navigateur, et nulle part ailleurs.</p>
      </DiagnosticHeader>

      <div className="bg-ivory-50">
        <div className="mx-auto max-w-5xl space-y-6 px-5 py-10 sm:px-8 sm:py-14">
          <StorageNotice />

          {sorted.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <BuildingIllustration slug="ecole" className="h-40 w-auto" />
              <h2 className="mt-6 text-2xl font-medium text-forest-900">Pas encore de diagnostic</h2>
              <p className="mt-2 max-w-md leading-relaxed text-ink-muted">
                Répondez à vingt questions sur votre établissement&nbsp;: votre rapport vous attendra ici.
              </p>
              <ButtonLink to={diagnosticPaths.intro} className="mt-6">
                Commencer un diagnostic
              </ButtonLink>
            </div>
          ) : (
            <>
              <ul className="grid gap-5 md:grid-cols-2">
                {sorted.map((assessment) => (
                  <HistoryCard
                    key={assessment.id}
                    assessment={assessment}
                    onResume={() => resume(assessment.id)}
                    onDelete={() => setToDelete(assessment)}
                  />
                ))}
              </ul>
              <ButtonLink to={diagnosticPaths.intro} variant="outline-dark">
                Nouveau diagnostic
              </ButtonLink>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Supprimer ce diagnostic ?"
        confirmLabel="Supprimer définitivement"
        danger
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) diagnosticActions.remove(toDelete.id)
          setToDelete(null)
        }}
      >
        {toDelete && (
          <p>
            «&nbsp;{institutionLabel(toDelete)}&nbsp;», du {formatDate(toDelete.createdAt)}, et toutes ses réponses seront
            effacés de cet appareil. Ce choix est définitif.
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}

function HistoryCard({ assessment, onResume, onDelete }: { assessment: Assessment; onResume: () => void; onDelete: () => void }) {
  const { overall, band } = computeResult(assessment.answers)
  const answered = questions.filter((q) => assessment.answers[q.id] !== undefined).length
  const typeLabel = institutionTypeLabel(assessment)
  const finished = assessment.completedAt !== null
  const label = institutionLabel(assessment)

  return (
    <li className="flex flex-col rounded-3xl bg-sage-100 p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl leading-tight font-medium text-forest-900">{label}</h2>
          <p className="mt-1 text-ink-muted">
            <span className={`font-semibold ${finished ? 'text-emerald-700' : 'text-gold-700'}`}>{finished ? 'Terminé' : 'En cours'}</span>
            {typeLabel && `, ${typeLabel.toLowerCase()}`}
          </p>
          <p className="text-sm text-ink-muted">
            Commencé le {formatDate(assessment.createdAt)}, modifié le {formatDateTime(assessment.updatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Supprimer le diagnostic « ${label} »`}
          className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-sage-200 hover:text-[#8a3622]"
        >
          <Trash aria-hidden="true" className="size-4.5" />
        </button>
      </div>

      <div className="mt-5 flex-1">
        {overall !== null && band ? (
          <>
            <p className="flex items-baseline gap-3">
              <span className="font-display text-6xl leading-none text-forest-900 tabular-nums">{overall}</span>
              <span className="flex items-center gap-2 text-lg font-semibold text-forest-900">
                <span aria-hidden="true" className="size-3 rounded-full" style={{ background: bandColors[band.id] }} />
                {band.label}
              </span>
            </p>
            <p className="mt-3 leading-relaxed text-ink-muted">{bandLines[band.id]}</p>
          </>
        ) : (
          <>
            <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-sage-300">
              <div className="h-full rounded-full bg-gold-400" style={{ width: `${(answered / questions.length) * 100}%` }} />
            </div>
            <p className="mt-3 text-ink-muted">
              {answered} réponse{answered > 1 ? 's' : ''} sur {questions.length}. Le score apparaîtra quand il y en aura assez.
            </p>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {finished ? (
          <ButtonLink to={diagnosticPaths.results(assessment.id)} variant="dark">
            Voir le rapport
          </ButtonLink>
        ) : (
          <>
            <button type="button" onClick={onResume} className={buttonClass('primary')}>
              Reprendre
            </button>
            <ButtonLink to={diagnosticPaths.results(assessment.id)} variant="outline-dark">
              Voir le rapport
            </ButtonLink>
          </>
        )}
      </div>
    </li>
  )
}
