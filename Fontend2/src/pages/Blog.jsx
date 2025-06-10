// Blog.js
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { blogData } from "../assets/data/db";
import { Link } from "react-router-dom";

const Blog = () => {
  const [filteredPosts, setFilteredPosts] = useState(blogData);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách categories độc nhất từ blogData
  const categories = [
    "Tất cả",
    ...new Set(blogData.map((post) => post.category)),
  ];

  // Xử lý filter và search
  useEffect(() => {
    let result = [...blogData];

    // Filter by category
    if (activeCategory !== "Tất cả") {
      result = result.filter((post) => post.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(result);
  }, [activeCategory, searchTerm]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035"
            alt="Blog Banner"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Blog & Tin Tức
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Khám phá những xu hướng tóc mới nhất, bí quyết chăm sóc tóc và các
            thông tin hữu ích từ các chuyên gia của chúng tôi
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    activeCategory === category
                      ? "bg-rose-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              to={`/blog-detail/${post.id}`}
              key={post.id}
              className="block group" // Thêm group để quản lý hover effects
            >
              <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
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
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-rose-500 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  {/* Author Section */}
                  <div className="flex items-center border-t pt-4">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-gray-900 font-medium">{post.author}</p>
                      <p className="text-gray-500 text-sm">{post.authorRole}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        onClick={(e) => {
                          e.preventDefault(); // Ngăn chặn navigation khi click vào tag
                          setActiveCategory("Tất cả");
                          setSearchTerm(tag);
                        }}
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

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">
              Không tìm thấy bài viết nào phù hợp
            </h3>
            <button
              onClick={() => {
                setActiveCategory("Tất cả");
                setSearchTerm("");
              }}
              className="mt-4 text-rose-500 font-medium hover:text-rose-600"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
