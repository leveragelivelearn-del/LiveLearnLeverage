/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User, Loader2, Trash2, Reply } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
    _id: string;
    name: string;
    email: string;
    content: string;
    createdAt: string;
    isAdmin: boolean;
    user?: {
        image?: string;
        name?: string;
    };
    parentId: string | null;
}

interface CommentSectionProps {
    postId: string;
    postType: "blog" | "model";
}

export function CommentSection({ postId, postType }: CommentSectionProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?postId=${postId}&postType=${postType}`);
            const data = await res.json();
            if (res.ok) {
                setComments(data);
            }
        } catch (err) {
            console.error("Failed to fetch comments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId, postType]);

    const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault();
        const text = parentId ? replyContent : content;
        if (!text.trim()) return;

        if (status !== "authenticated") {
            router.push("/login?callbackUrl=" + encodeURIComponent(window.location.href));
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId,
                    postType,
                    content: text,
                    parentId
                }),
            });

            if (res.ok) {
                if (parentId) {
                    setReplyContent("");
                    setReplyingTo(null);
                } else {
                    setContent("");
                }
                fetchComments(); // Refresh list
            } else {
                const data = await res.json();
                setError(data.error || "Failed to post comment");
            }
        } catch (err) {
            console.error("Error posting comment", err);
            setError("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        setDeletingId(commentId);
        try {
            const res = await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
            if (res.ok) {
                setComments(comments.filter(c => c._id !== commentId && c.parentId !== commentId));
            } else {
                alert("Failed to delete comment");
            }
        } catch (err) {
            console.error("Error deleting comment", err);
        } finally {
            setDeletingId(null);
        }
    }

    // Group comments by parent
    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
        const replies = getReplies(comment._id);
        const isAuthor = session?.user?.email === comment.email; // Simple email check for now, can use ID if available
        //   const canDelete = session?.user?.role === 'admin' || isAuthor;
        // FIX: Assuming role is available in session.user type (it should be based on auth.ts)
        const isAdmin = (session?.user as any)?.role === 'admin';
        const canDelete = isAdmin || isAuthor;

        return (
            <div className={`flex gap-4 ${isReply ? "ml-12 mt-4" : "mt-6"}`}>
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={comment.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}`} />
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${comment.isAdmin ? "text-primary" : ""}`}>
                                {comment.name}
                            </span>
                            {comment.isAdmin && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                    Admin
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-1">
                        {status === 'authenticated' && !isReply && (
                            <button
                                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-medium transition-colors"
                            >
                                <Reply className="h-3 w-3" /> Reply
                            </button>
                        )}
                        {canDelete && (
                            <button
                                onClick={() => handleDelete(comment._id)}
                                disabled={deletingId === comment._id}
                                className="text-xs text-red-500/70 hover:text-red-500 flex items-center gap-1 font-medium transition-colors"
                            >
                                {deletingId === comment._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                        <form onSubmit={(e) => handleSubmit(e, comment._id)} className="mt-4 flex gap-2">
                            <Textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Reply to ${comment.name}...`}
                                className="min-h-[60px] text-sm"
                                autoFocus
                            />
                            <div className="flex flex-col gap-2">
                                <Button type="submit" size="sm" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                        <div className="space-y-4">
                            {replies.map(reply => (
                                <CommentItem key={reply._id} comment={reply} isReply={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-card border rounded-lg p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-xl font-bold">
                <MessageSquare className="h-5 w-5" />
                <h3>Comments ({comments.length})</h3>
            </div>

            {/* Main Comment Form */}
            <div className="space-y-4">
                {status === "loading" ? (
                    <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                ) : status === "authenticated" ? (
                    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10 border hidden sm:block">
                                <AvatarImage src={session.user?.image || ""} />
                                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <Textarea
                                    placeholder="What are your thoughts?"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[100px]"
                                    required
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={submitting}>
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Post Comment
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="bg-secondary/20 rounded-lg p-6 text-center space-y-3">
                        <p className="text-muted-foreground">Log in to join the discussion</p>
                        <Button onClick={() => router.push("/login?callbackUrl=" + encodeURIComponent(window.location.href))}>
                            Log In to Comment
                        </Button>
                    </div>
                )}
            </div>

            {/* Comment List */}
            <div className="space-y-6 pt-4">
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-muted animate-pulse" />
                                    <div className="h-16 w-full bg-muted animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : rootComments.length > 0 ? (
                    rootComments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} />
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-8">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                )}
            </div>
        </div>
    );
}
