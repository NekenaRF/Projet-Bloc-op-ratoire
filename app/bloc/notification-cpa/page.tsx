'use client'

import HeaderNotification from '@/components/bloc/notification-cpa/HeaderNotification'
import StatsNotification from '@/components/bloc/notification-cpa/StatsNotification'
import TableauNotifications from '@/components/bloc/notification-cpa/TableauNotifications'
import { mockNotificationsCPA, mockStatsNotification } from '@/lib/mock/notification-cpa'

export default function NotificationCPAPage() {
  return (
    <div className="p-8 flex flex-col gap-6">

      {/* HEADER */}
      <HeaderNotification />

      {/* STATS */}
      <StatsNotification stats={mockStatsNotification} />

      {/* TABLEAU */}
      <TableauNotifications notifications={mockNotificationsCPA} />

    </div>
  )
}


