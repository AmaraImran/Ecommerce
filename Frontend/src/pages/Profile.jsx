import { useEffect, useState } from "react";
import api from "../services/api";
import { Pencil, X } from "lucide-react";

// simple deterministic color pick based on name, so the same user always gets the same avatar color
const avatarColors = ["#3F5B4E", "#6B7A4F", "#B0794A", "#8A6C9C", "#4A7C8C"];
function getAvatarColor(name) {
  const index = (name?.charCodeAt(0) || 0) % avatarColors.length;
  return avatarColors[index];
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setFormData({
        name: res.data.user.name || "",
        phone: res.data.user.phone || "",
        address: res.data.user.address || "",
      });
    } catch (err) {
      setError("Couldn't load your profile. Please try again.",err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleCancel = () => {
    // revert any unsaved changes back to the last saved profile
    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setError("");
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const res = await api.patch("/user/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F7F1E6] flex items-center justify-center">
        <p className="text-[#5C5346]">{error || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1E6] px-6 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2B2420] mb-8">My Profile</h1>

        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-8 shadow-sm">

          {/* Avatar + name header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E3D8C4]">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-[#FBF7EE] text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: getAvatarColor(profile.name) }}
            >
              {profile.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-lg font-semibold text-[#2B2420]">{profile.name}</p>
              <p className="text-sm text-[#8A8070]">{profile.email}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}
          {success && !editing && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
              {success}
            </div>
          )}

          {!editing ? (
            /* VIEW MODE */
            <div className="space-y-4">
              <InfoRow label="Full Name" value={profile.name} />
              <InfoRow label="Phone" value={profile.phone || "Not added yet"} />
              <InfoRow label="Default Shipping Address" value={profile.address || "Not added yet"} />

              <button
                onClick={() => {
                  setSuccess("");
                  setEditing(true);
                }}
                className="w-full flex items-center justify-center gap-2 border border-[#3F5B4E] text-[#3F5B4E] py-3 rounded-lg font-semibold hover:bg-[#3F5B4E] hover:text-[#FBF7EE] transition mt-4"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded border border-[#E3D8C4] bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Add a phone number"
                  className="w-full px-4 py-3 rounded border border-[#E3D8C4] bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                  Default Shipping Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, city, postal code"
                  className="w-full px-4 py-3 rounded border border-[#E3D8C4] bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#E3D8C4] text-[#5C5346] py-3 rounded-lg font-semibold hover:bg-[#F0EBDF] transition"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#3F5B4E] hover:bg-[#2F4A3D] transition-colors duration-300 text-[#FBF7EE] py-3 rounded-lg font-semibold disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[#8A8070] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-[#2B2420]">{value}</p>
    </div>
  );
}