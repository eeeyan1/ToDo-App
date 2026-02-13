"use client";

import * as React from "react";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useUser();
  const [username, setUsername] = React.useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatarUrl || "");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(user?.avatarUrl || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatarUrl(user.avatarUrl || "");
      setPreviewUrl(user.avatarUrl);
    }
  }, [user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    updateProfile({
      username: username.trim(),
      avatarUrl: avatarUrl || null,
    });
    onClose();
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>

        <h2 className="mb-6 text-xl font-semibold text-white">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white/10"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-2xl font-semibold text-white ring-4 ring-white/10">
                  {initials || "?"}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                Upload Photo
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="border-white/20 bg-white/5 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <Input
              value={user?.email || ""}
              disabled
              className="border-white/10 bg-white/5 text-zinc-500"
            />
            <p className="text-xs text-zinc-500">Email cannot be changed</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
