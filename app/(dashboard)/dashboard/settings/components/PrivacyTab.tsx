'use client'

interface PrivacyState {
  dataExport: boolean
  shareUsageData: boolean
  marketingEmails: boolean
}

interface PrivacyTabProps {
  privacy: PrivacyState
  onPrivacyChange: (key: string, value: boolean) => void
  onExportData: () => void
  onDeleteAccount: () => void
}

export default function PrivacyTab({ 
  privacy, 
  onPrivacyChange, 
  onExportData, 
  onDeleteAccount 
}: PrivacyTabProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-base-content mb-2">Privacy & Security</h2>
      <p className="text-base-content/70 mb-6">Manage your data privacy and account security</p>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-base-content mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Export My Data</div>
                <div className="text-sm text-base-content/70">Download all your transaction data</div>
              </div>
              <button onClick={onExportData} className="btn btn-outline btn-primary btn-sm">
                Export
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Share Usage Data</div>
                <div className="text-sm text-base-content/70">Help improve our app with anonymous usage data</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={privacy.shareUsageData}
                onChange={(e) => onPrivacyChange('shareUsageData', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-base-300 rounded-lg">
              <div>
                <div className="font-medium">Marketing Emails</div>
                <div className="text-sm text-base-content/70">Receive updates about new features and tips</div>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={privacy.marketingEmails}
                onChange={(e) => onPrivacyChange('marketingEmails', e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
          <div className="border-2 border-error/20 rounded-lg p-6 bg-error/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-error">Delete Account</div>
                <div className="text-sm text-base-content/70">
                  Permanently delete your account and all associated data
                </div>
              </div>
              <button 
                onClick={onDeleteAccount}
                className="btn btn-error btn-outline btn-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}