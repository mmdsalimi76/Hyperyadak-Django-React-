import React, { useState } from "react";

function ProductComments({ productId }) {
  // Sample initial comments (can be removed or customized)

  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const newCommentObj = {
        id: Date.now(),
        user_name: "کاربر مهمان",
        text: newComment.trim(),
        created_at: new Date().toISOString(),
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setError(null);
    } catch (err) {
      setError("خطا در ارسال نظر");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="نظر خود را بنویسید..."
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none font-vazirmatn"
          rows="4"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-sky-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-sky-700 transition disabled:opacity-50"
          >
            {submitting ? "در حال ارسال..." : "ارسال نظر"}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      {/* Comments list */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">
            هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-800">
                  {comment.user_name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductComments;
