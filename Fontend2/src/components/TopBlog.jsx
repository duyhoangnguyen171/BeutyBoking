// components/RelatedPosts.js
import React from "react";
import { Link } from "react-router-dom";
import { blogData } from "../assets/data/db";

const TopBlog = () => {
  if (blogData.length === 0) {
    return (
      <div className="">
        <p>không có dữ liệu</p>
      </div>
    );
  }

  return (
    <section className="my-16">
      <h2 className="text-3xl font-medium text-center mb-16">
        Bài Viết Liên Quan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogData
          .map((post) => (
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
                </div>
              </article>
            </Link>
          ))
          .slice(0, 3)}
      </div>
    </section>
  );
};

export default TopBlog;
