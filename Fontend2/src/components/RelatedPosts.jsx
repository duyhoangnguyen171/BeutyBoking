// components/RelatedPosts.js
import React from "react";
import { Link } from "react-router-dom";
import { blogData } from "../assets/data/db";

const RelatedPosts = ({ currentPost, limit = 3 }) => {
  // Hàm tính điểm liên quan giữa hai bài viết
  const calculateRelevanceScore = (post1, post2) => {
    let score = 0;

    // Cùng category được 3 điểm
    if (post1.category === post2.category) {
      score += 3;
    }

    // Mỗi tag trùng nhau được 1 điểm
    const commonTags = post1.tags.filter((tag) => post2.tags.includes(tag));
    score += commonTags.length;

    return score;
  };

  // Lọc và sắp xếp các bài viết liên quan
  const relatedPosts = blogData
    .filter((post) => post.id !== currentPost.id) // Loại bỏ bài viết hiện tại
    .map((post) => ({
      ...post,
      relevanceScore: calculateRelevanceScore(currentPost, post),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sắp xếp theo điểm liên quan
    .slice(0, limit); // Giới hạn số lượng bài viết

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Bài Viết Liên Quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog-detail/${post.id}`}
            className="group block"
            onClick={() => window.scrollTo(0, 0)} // Cuộn lên đầu trang khi chuyển bài
          >
            <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Meta info */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.description}
                </p>

                {/* Common Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags
                    .filter((tag) => currentPost.tags.includes(tag))
                    .slice(0, 3)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
