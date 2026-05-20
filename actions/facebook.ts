export type FacebookReview = {
  id: string;
  reviewerName: string;
  reviewerPicture?: string;
  text: string;
  rating: number;
  url?: string;
  publishedAt?: number;
};

type ElfsightReviewNode = {
  id?: string;
  reviewer_name?: string;
  reviewer_picture_url?: string;
  rating?: number;
  text?: string;
  url?: string;
  published_at?: number;
};

type ElfsightResponse = {
  status?: string;
  result?: {
    data?: ElfsightReviewNode[];
  };
};

const ENDPOINT =
  "https://service-reviews-ultimate.elfsight.com/data/reviews?uris%5B%5D=https%3A%2F%2Ffacebook.com%2FFogorvosDentist&filter_content=text_required&min_rating=5&page_length=6&order=date";

export const getFacebookReviews = async (): Promise<FacebookReview[]> => {
  try {
    const response = await fetch(ENDPOINT, {
      next: { revalidate: 3600 }, // cache for an hour
    });

    if (!response.ok) {
      console.error(
        "[reviews] Elfsight returned non-OK status:",
        response.status,
      );
      return [];
    }

    const data = (await response.json()) as ElfsightResponse;

    if (data.status !== "success") {
      console.error("[reviews] Elfsight non-success status:", data.status);
      return [];
    }

    const nodes = data.result?.data ?? [];

    return nodes
      .filter((node) => node.text?.trim())
      .map((node) => ({
        id: node.id ?? `${node.reviewer_name ?? "anon"}-${node.published_at ?? Math.random()}`,
        reviewerName: node.reviewer_name?.trim() || "Facebook user",
        reviewerPicture: node.reviewer_picture_url,
        text: node.text!.trim(),
        rating: node.rating ?? 5,
        url: node.url,
        publishedAt: node.published_at,
      }));
  } catch (error: unknown) {
    console.error("[reviews] fetch failed:", (error as Error).message);
    return [];
  }
};
