import { useMemo, useState } from 'react'
import StatusChip from '@/features/staff/components/StatusChip'
import AddStaffModal from '@/features/staff/components/AddStaffModal'
import { STAFF_MEMBERS, STAFF_STATS } from '@/features/staff/data/staff.data'

export default function StaffDirectory() {
  const [staff, setStaff] = useState(STAFF_MEMBERS)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return staff
    return staff.filter((member) =>
      [member.name, member.id, member.department].some((field) => field.toLowerCase().includes(query)),
    )
  }, [staff, search])

  const handleAddStaff = (values) => {
    setStaff((prev) => [
      {
        id: `EMP-${100 + prev.length + 5}`,
        name: values.name,
        email: values.email,
        designation: values.designation,
        department: values.department,
        status: 'active',
      },
      ...prev,
    ])
  }

  const toggleStatus = (id) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' } : member,
      ),
    )
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-unit-md md:flex-row md:items-end">
        <div>
          <h2 className="mb-unit-xs font-[var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-display-lg">
            Staff Directory
          </h2>
          <p className="text-body-lg text-on-surface-variant">Manage personnel, roles, and administrative access.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-unit-md py-unit-sm text-label-bold font-bold tracking-[0.05em] text-on-primary uppercase transition-colors hover:bg-primary"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Staff Member
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-unit-md">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, ID, or department..."
          className="h-9 min-w-[220px] flex-1 rounded-lg border border-border-light bg-surface-container-lowest px-4 text-body-md text-on-surface shadow-sm transition-shadow focus:border-primary-container focus:ring-2 focus:ring-primary-container focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-2 text-label-md text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-status-completed" />
          <span className="font-medium text-on-surface">{STAFF_STATS.active}</span> of{' '}
          <span className="font-medium text-on-surface">{STAFF_STATS.total}</span> active
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-light bg-surface-container-lowest shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-light bg-surface-subtle text-label-bold font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                <th className="p-unit-md py-unit-sm font-medium">ID</th>
                <th className="p-unit-md py-unit-sm font-medium">Staff Member</th>
                <th className="p-unit-md py-unit-sm font-medium">Designation</th>
                <th className="p-unit-md py-unit-sm font-medium">Department</th>
                <th className="p-unit-md py-unit-sm font-medium">Status</th>
                <th className="p-unit-md py-unit-sm text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-body-md text-on-surface">
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  className={`group transition-colors hover:bg-surface-subtle ${
                    member.status === 'inactive' ? 'opacity-70' : ''
                  }`}
                >
                  <td className="p-unit-md text-on-surface-variant">#{member.id}</td>
                  <td className="p-unit-md">
                    <p className="font-bold text-on-surface">{member.name}</p>
                    <p className="text-label-md text-on-surface-variant">{member.email}</p>
                  </td>
                  <td className="p-unit-md">{member.designation}</td>
                  <td className="p-unit-md text-on-surface-variant">{member.department}</td>
                  <td className="p-unit-md">
                    <StatusChip status={member.status} />
                  </td>
                  <td className="p-unit-md text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        title="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        type="button"
                        title="Reset Password"
                        className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                      </button>
                      <button
                        type="button"
                        title={member.status === 'active' ? 'Deactivate' : 'Reactivate'}
                        onClick={() => toggleStatus(member.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors ${
                          member.status === 'active'
                            ? 'hover:bg-error-container hover:text-error'
                            : 'hover:bg-status-completed/20 hover:text-status-completed'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {member.status === 'active' ? 'person_off' : 'person_add'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-unit-lg text-center text-on-surface-variant">
                    No staff members match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border-light bg-surface-subtle px-unit-md py-unit-sm text-label-md text-on-surface-variant">
          Showing {filteredStaff.length} of {staff.length} entries
        </div>
      </div>

      {isModalOpen && <AddStaffModal onClose={() => setIsModalOpen(false)} onAdd={handleAddStaff} />}
    </>
  )
}
