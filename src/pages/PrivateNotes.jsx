import { useMemo, useState } from 'react'
import NotesList from '@/features/notes/components/NotesList'
import NoteEditor from '@/features/notes/components/NoteEditor'
import { INITIAL_NOTES } from '@/features/notes/data/notes.data'
import { stripHtml } from '@/features/notes/utils/notes.utils'

export default function PrivateNotes() {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [selectedNoteId, setSelectedNoteId] = useState(INITIAL_NOTES[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const counts = useMemo(
    () => ({
      all: notes.filter((note) => !note.archived).length,
      pinned: notes.filter((note) => !note.archived && note.pinned).length,
    }),
    [notes],
  )

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase()

    let list = notes.filter((note) => (activeTab === 'archive' ? note.archived : !note.archived))
    if (activeTab === 'pinned') list = list.filter((note) => note.pinned)

    list = [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    if (activeTab === 'recent') list = list.slice(0, 5)

    if (query) {
      list = list.filter(
        (note) => note.title.toLowerCase().includes(query) || stripHtml(note.contentHtml).toLowerCase().includes(query),
      )
    }

    return list
  }, [notes, activeTab, search])

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null

  const handleCreateNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: '',
      contentHtml: '',
      pinned: false,
      archived: false,
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
    setActiveTab('all')
    setSearch('')
  }

  const handleSaveNote = (id, { title, contentHtml }) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, title, contentHtml, updatedAt: new Date().toISOString() } : note)),
    )
  }

  const handleDeleteNote = (id) => {
    const remaining = notes.filter((note) => note.id !== id)
    setNotes(remaining)
    if (selectedNoteId === id) {
      setSelectedNoteId(remaining[0]?.id ?? null)
    }
  }

  const handleTogglePin = (id) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)))
  }

  const handleToggleArchive = (id) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, archived: !note.archived } : note)))
  }

  return (
    <>
      <div className="flex flex-col gap-unit-md rounded-xl bg-surface-container-lowest p-unit-lg shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-unit-xs">
          <div className="flex items-center gap-unit-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-primary-container" />
            <span className="text-label-bold font-bold tracking-[0.05em] text-primary uppercase">
              Confidential Storage
            </span>
          </div>
          <h1 className="font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Private Notes
          </h1>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Personal notes with rich text formatting. Visible only to you.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-unit-md sm:flex-row sm:items-center">
          <div className="relative min-w-[240px]">
            <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes by title or keyword..."
              className="w-full rounded-lg bg-surface-container-low py-2 pr-4 pl-10 text-body-md text-on-surface transition-all placeholder:text-on-surface-variant/70 focus:bg-surface-subtle focus:shadow-md focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleCreateNote}
            className="flex items-center justify-center gap-unit-sm rounded-lg bg-primary-container px-unit-lg py-2.5 text-label-bold font-bold text-on-primary shadow-md transition-all hover:opacity-95 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-unit-lg lg:grid-cols-12">
        <NotesList
          notes={filteredNotes}
          counts={counts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
        />
        <NoteEditor
          note={selectedNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
        />
      </div>
    </>
  )
}
