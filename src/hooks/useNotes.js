import { useMutation, useQuery } from '@tanstack/react-query'
import { notesService } from '@/services/notes.service'

export const useNotesList = () =>
  useQuery({
    queryKey: ['notes'],
    queryFn: notesService.list,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

export const useDashboardNotes = () =>
  useQuery({
    queryKey: ['notes', 'dashboard'],
    queryFn: notesService.list,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

export const useCreateNote = () =>
  useMutation({
    mutationFn: notesService.create,
  })

export const useToggleNotePin = () =>
  useMutation({
    mutationFn: notesService.togglePin,
  })

export const useToggleNoteArchive = () =>
  useMutation({
    mutationFn: notesService.toggleArchive,
  })

export const useDeleteNote = () =>
  useMutation({
    mutationFn: notesService.remove,
  })
