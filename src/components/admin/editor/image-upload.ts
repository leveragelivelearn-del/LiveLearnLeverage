import { createImageUpload } from "novel";
import { toast } from "sonner";

// Use IMGBB if possible (simple client-side upload or server-side proxy).
// Since we have an IMGBB_API_KEY in .env.local, we should use a server action or API route.
// For now, let's use a simple placeholder upload function that mocks it if we don't have the API route ready.
// Or even better, try to use IMGBB client-side upload if the key is exposed, but better not expose it.
// We will assume /api/upload exists or just return a placeholder.

// Actually, I'll create a minimal /api/upload route in the next step to support this properly using ImgBB.

const onUpload = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const promise = fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
    });

    return new Promise((resolve, reject) => {
        toast.promise(
            promise.then(async (res) => {
                // Successfully uploaded image
                if (res.status === 200) {
                    const { url } = (await res.json()) as { url: string };
                    // preload the image
                    const image = new Image();
                    image.src = url;
                    
                    const cleanup = () => {
                        image.onload = null;
                        image.onerror = null;
                        image.onabort = null;
                    };
                    
                    image.onload = () => {
                        cleanup();
                        resolve(url);
                    };
                    image.onerror = (err) => {
                        cleanup();
                        reject(new Error(`Failed to load image: ${url}. Details: ${err}`));
                    };
                    image.onabort = () => {
                        cleanup();
                        reject(new Error(`Aborted image load: ${url}`));
                    };
                    // No blob store configured
                } else if (res.status === 401 || res.status === 503) {
                    throw new Error("Unauthorized: missing BLOB_READ_WRITE_TOKEN");
                    // Unknown error
                } else {
                    throw new Error("Error uploading image. Please try again.");
                }
            }),
            {
                loading: "Uploading image...",
                success: "Image uploaded successfully.",
                error: (e) => {
                    reject(e);
                    return e.message;
                },
            },
        );
    });
};

export const uploadFn = createImageUpload({
    onUpload,
    validateFn: (file) => {
        if (!file.type.includes("image/")) {
            toast.error("File type not supported.");
            return false;
        }
        if (file.size / 1024 / 1024 > 20) {
            toast.error("File size too big (max 20MB).");
            return false;
        }
        return true;
    },
});
