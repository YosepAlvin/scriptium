"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { addReview } from "@/lib/actions/review";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  canReview: boolean;
}

export default function ProductReviews({ productId, reviews, canReview }: ProductReviewsProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await addReview(productId, rating, comment);
      setSuccess(true);
      setComment("");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Reviews List */}
      <div>
        <h3 className="font-playfair text-2xl font-bold mb-8">Ulasan ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-sm text-[#666666] italic">Belum ada ulasan untuk produk ini.</p>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-[#E5E5E5] pb-8 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                      {review.user.image ? (
                        <img src={review.user.image} alt={review.user.name || "User"} className="w-full h-full object-cover" />
                      ) : (
                        <User size={14} className="text-[#999999]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">{review.user.name || "Pengguna"}</p>
                      <p className="text-[10px] text-[#999999]">{new Date(review.createdAt).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= review.rating ? "fill-[#C2A76D] text-[#C2A76D]" : "text-[#E5E5E5]"}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-[#444444] leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form */}
      {canReview && !success && (
        <div className="bg-[#F9F7F5] p-8 border border-[#E5E5E5]">
          <h4 className="font-playfair text-lg font-bold mb-6">Tulis Ulasan</h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#666666] mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={20}
                      className={star <= rating ? "fill-[#C2A76D] text-[#C2A76D]" : "text-[#CCCCCC]"}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#666666] mb-2">Komentar</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white border border-[#E5E5E5] px-4 py-3 text-sm focus:border-[#1A1A1A] focus:outline-none transition-colors min-h-[100px]"
                placeholder="Bagikan pengalaman Anda..."
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </form>
        </div>
      )}

      {success && (
        <div className="bg-green-50 p-6 border border-green-100 text-center">
          <p className="text-green-800 text-sm font-medium">Terima kasih! Ulasan Anda telah berhasil dikirim.</p>
        </div>
      )}
    </div>
  );
}
