import { requireAuth } from "../../lib/auth";
import UserProfile from "../../components/UserProfile";

/**
 * Example page that uses server-side route protection
 */
export default async function SettingsPage() {
  // This will redirect to sign-in if user is not authenticated
  const session = await requireAuth("/settings");

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <UserProfile />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Profile</h3>
          <p className="text-gray-600 mb-4">
            Update your personal information and contact details.
          </p>
          <a
            href="/profile"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Edit Profile
          </a>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Security</h3>
          <p className="text-gray-600 mb-4">
            Manage your password and account security settings.
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Security Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Notifications</h3>
          <p className="text-gray-600 mb-4">
            Configure how you receive notifications and alerts.
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Notification Preferences
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Organization</h3>
          <p className="text-gray-600 mb-4">
            Manage your organization settings and user roles.
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Organization Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Appearance</h3>
          <p className="text-gray-600 mb-4">
            Customize the appearance and behavior of your dashboard.
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Appearance Settings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">API & Integrations</h3>
          <p className="text-gray-600 mb-4">
            Manage API keys and third-party service integrations.
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Integration Settings
          </button>
        </div>
      </div>
    </div>
  );
}
