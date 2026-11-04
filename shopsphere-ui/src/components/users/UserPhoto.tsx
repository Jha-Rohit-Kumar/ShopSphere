
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { User } from '../../types/User';
import {
    getUserPhoto,
    uploadUserPhoto,
    deleteUserPhoto
} from '../../services/userService';

interface UserPhotoProps {
    user: User;
}

function UserPhoto({ user }: UserPhotoProps) {

    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [hasPhoto, setHasPhoto] = useState(
        Boolean(user.profileImageName || user.profileImageUrl)
    );
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let active = true;
        let objectUrl: string | null = null;

        const fetchPhoto = async () => {
            if (!hasPhoto) {
                setPhotoUrl(null);
                return;
            }

            try {
                setLoading(true);

                const blob = await getUserPhoto(user.id);

                if (active) {
                    objectUrl = URL.createObjectURL(blob);
                    setPhotoUrl(objectUrl);
                }
            } catch (err) {
                console.error('Unable to fetch profile photo:', err);
                if (active) {
                    setPhotoUrl(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchPhoto();

        return () => {
            active = false;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [user.id, hasPhoto, refreshKey]);

    const handleUpload = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setError('');

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('Only JPG, PNG and WebP images are allowed.');
            event.target.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image size cannot exceed 2 MB.');
            event.target.value = '';
            return;
        }

        try {
            setSaving(true);

            await uploadUserPhoto(user.id, file);

            setHasPhoto(true);
            setRefreshKey(previous => previous + 1);

        } catch (err) {
            console.error('Unable to upload photo:', err);
            setError('Unable to upload profile photo.');
        } finally {
            setSaving(false);
            event.target.value = '';
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this profile photo?'
        );

        if (!confirmed) return;

        try {
            setSaving(true);
            setError('');

            await deleteUserPhoto(user.id);

            setHasPhoto(false);
            setPhotoUrl(null);

        } catch (err) {
            console.error('Unable to delete photo:', err);
            setError('Unable to delete profile photo.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="d-flex align-items-center gap-2">

                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={`${user.firstName}'s profile`}
                        className="rounded-circle"
                        width="45"
                        height="45"
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                        style={{
                            width: '45px',
                            height: '45px',
                            fontWeight: 'bold'
                        }}
                    >
                        {user.firstName?.charAt(0).toUpperCase()}
                    </div>
                )}

                {loading && (
                    <span className="spinner-border spinner-border-sm" />
                )}

                <label className="btn btn-sm btn-outline-primary mb-0">
                    {saving ? 'Saving...' : hasPhoto ? 'Change' : 'Upload'}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                        disabled={saving}
                        onChange={handleUpload}
                    />
                </label>

                {hasPhoto && (
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleDelete}
                        disabled={saving}
                    >
                        Remove
                    </button>
                )}

            </div>

            {error && (
                <small className="text-danger d-block mt-1">
                    {error}
                </small>
            )}
        </div>
    );
}

export default UserPhoto;
