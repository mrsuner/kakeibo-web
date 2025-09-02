'use client'

interface NotificationsState {
  emailTransactions: boolean
  emailBudgetAlerts: boolean
  emailMonthlyReport: boolean
  pushTransactions: boolean
  pushBudgetAlerts: boolean
}

interface NotificationsTabProps {
  notifications: NotificationsState
  onNotificationChange: (key: string, value: boolean) => void
}

export default function NotificationsTab({ 
  notifications, 
  onNotificationChange 
}: NotificationsTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-base-content mb-2">Notification Preferences</h2>
      <p className="text-base-content/70 mb-6">Choose how you want to be notified about your financial activity</p>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Transaction Notifications</div>
                <div className="text-sm text-base-content/70">Get notified when transactions are added</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={notifications.emailTransactions}
                onChange={(e) => onNotificationChange('emailTransactions', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Budget Alerts</div>
                <div className="text-sm text-base-content/70">Alerts when you approach budget limits</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={notifications.emailBudgetAlerts}
                onChange={(e) => onNotificationChange('emailBudgetAlerts', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Monthly Reports</div>
                <div className="text-sm text-base-content/70">Monthly spending summary and insights</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={notifications.emailMonthlyReport}
                onChange={(e) => onNotificationChange('emailMonthlyReport', e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-base-content mb-4">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Transaction Notifications</div>
                <div className="text-sm text-base-content/70">Push notifications for new transactions</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={notifications.pushTransactions}
                onChange={(e) => onNotificationChange('pushTransactions', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Budget Alerts</div>
                <div className="text-sm text-base-content/70">Push alerts for budget thresholds</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={notifications.pushBudgetAlerts}
                onChange={(e) => onNotificationChange('pushBudgetAlerts', e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}