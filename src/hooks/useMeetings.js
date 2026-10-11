import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { meetingsService } from '@/services/meetings.service'

// Every meeting query (the calendar's range list and the upcoming panel) lives under ['meetings', ...], so
// one invalidation after any change re-reads whatever is on screen.
const useInvalidateMeetings = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['meetings'] })
}

export const useCreateMeeting = () => {
  const invalidateMeetings = useInvalidateMeetings()
  return useMutation({
    mutationFn: meetingsService.create,
    onSuccess: invalidateMeetings,
  })
}

export const useUpdateMeeting = () => {
  const invalidateMeetings = useInvalidateMeetings()
  return useMutation({
    mutationFn: ({ meetingId, payload }) => meetingsService.update(meetingId, payload),
    onSuccess: invalidateMeetings,
  })
}

export const useDeleteMeeting = () => {
  const invalidateMeetings = useInvalidateMeetings()
  return useMutation({
    mutationFn: (meetingId) => meetingsService.remove(meetingId),
    onSuccess: invalidateMeetings,
  })
}

// One page of the meetings in a date range - what the month/week/day views draw. The previous page stays
// on screen while the next one loads, so changing page or window doesn't flash empty.
export const useMeetingsList = ({ from, to, page, limit }) =>
  useQuery({
    queryKey: ['meetings', 'list', { from, to, page, limit }],
    queryFn: () => meetingsService.list({ from, to, page, limit }),
    placeholderData: (previousData) => previousData,
  })

// A meeting leaves this list the minute it starts, so it's re-read every minute and when the tab regains focus.
const UPCOMING_REFRESH_INTERVAL_MS = 60 * 1000

export const useUpcomingMeetings = ({ page = 1, limit = 30 } = {}) =>
  useQuery({
    queryKey: ['meetings', 'upcoming', { page, limit }],
    queryFn: () => meetingsService.upcoming({ page, limit }),
    refetchInterval: UPCOMING_REFRESH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  })
