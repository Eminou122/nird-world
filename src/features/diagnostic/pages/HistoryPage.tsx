import { ArrowRight, FileText, Play, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ButtonLink, buttonClass } from '../../../components/ui/ButtonLink'
import { questions } from '../data/questions'
import { computeResult } from '../engine/scoring'
import { diagnosticActions, useDiagnosticStore } from '../hooks/useDiagnosticStore'
import type { Assessment } from '../types/diagnostic'
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
import { diagnosticPaths } from '../paths'

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
      <title>Historique des diagnostics — NIRD WORLD</title>
      <DiagnosticHeader
        crumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Le village', to: '/village' },
          { label: 'École', to: diagnosticPaths.intro },
          { label: 'Historique' },
        ]}
        eyebrow="Diagnostic d’indépendance numérique"
        title="Historique des diagnostics"
      >
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ivory-100/75">
          Les diagnostics enregistrés dans ce navigateur. Ils ne sont partagés avec personne. Supprimer un diagnostic
          l’efface définitivement de cet appareil.
        </p>
      </DiagnosticHeader>

      <div className="bg-ivory-100 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-8">
          <StorageNotice />

          {sorted.length === 0 ? (
            <div className="rounded-2xl bg-ivory-50 p-8 text-center ring-1 ring-ivory-300/80">
              <FileText aria-hidden="true" className="mx-auto size-8 text-emerald-700" />
              <h2 className="mt-4 text-2xl font-medium text-forest-900">Aucun diagnostic enregistré</h2>
              <p className="mt-2 text-ink-muted">Vos diagnostics apparaîtront ici dès que vous en aurez commencé un.</p>
              <ButtonLink to={diagnosticPaths.intro} className="mt-6">
                <Play aria-hidden="true" /> Commencer un diagnostic
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-medium text-forest-900">
                  {sorted.length} diagnostic{sorted.length > 1 ? 's' : ''}
                </h2>
                <ButtonLink to={diagnosticPaths.intro} variant="dark">
                  <Plus aria-hidden="true" /> Nouveau diagnostic
                </ButtonLink>
              </div>
              <ul className="space-y-4">
                {sorted.map((assessment) => (
                  <HistoryItem
                    key={assessment.id}
                    assessment={assessment}
                    onResume={() => resume(assessment.id)}
                    onDelete={() => setToDelete(assessment)}
                  />
                ))}
              </ul>
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
            Le diagnostic « {institutionLabel(toDelete)} » du {formatDate(toDelete.createdAt)} et toutes ses réponses
            seront effacés de cet appareil. Cette action est irréversible.
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}

function HistoryItem({ assessment, onResume, onDelete }: { assessment: Assessment; onResume: () => void; onDelete: () => void }) {
  const result = computeResult(assessment.answers)
  const answered = questions.filter((q) => assessment.answers[q.id] !== undefined).length
  const typeLabel = institutionTypeLabel(assessment)
  const finished = assessment.completedAt !== null

  return (
    <li className="flex flex-col gap-5 rounded-2xl bg-ivory-50 p-5 ring-1 ring-ivory-300/80 sm:flex-row sm:items-center sm:p-6">
      <div className="shrink-0 sm:w-44">
        {result.overall !== null && result.band ? (
          <>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-5xl leading-none text-forest-900 tabular-nums">{result.overall}</span>
              <span className="text-sm text-ink-muted">/ 100</span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-forest-900">
              <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: bandColors[result.band.id] }} />
              {result.band.label}
            </p>
          </>
        ) : (
          <span className="text-sm leading-snug text-ink-muted">
            <span className="block font-display text-2xl text-forest-900 tabular-nums">
              {answered}/{questions.length}
            </span>
            réponses · score non calculable
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-medium text-forest-900">{institutionLabel(assessment)}</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              finished ? 'bg-emerald-600/10 text-emerald-700' : 'bg-gold-400/20 text-gold-700'
            }`}
          >
            {finished ? 'Terminé' : 'En cours'}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          {[typeLabel, `Commencé le ${formatDate(assessment.createdAt)}`, `modifié le ${formatDateTime(assessment.updatedAt)}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!finished && (
          <button type="button" onClick={onResume} className={buttonClass('dark')}>
            Continuer <ArrowRight aria-hidden="true" />
          </button>
        )}
        <Link to={diagnosticPaths.results(assessment.id)} className={buttonClass(finished ? 'dark' : 'outline-dark')}>
          Voir le rapport
        </Link>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Supprimer le diagnostic « ${institutionLabel(assessment)} »`}
          className={buttonClass('outline-dark', 'px-3.5 text-[#8a3622]')}
        >
          <Trash aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
