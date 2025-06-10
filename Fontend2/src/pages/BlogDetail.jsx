import React from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { blogData, blogContent } from "../assets/data/db";
import RelatedPosts from "../components/RelatedPosts";

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogData.find((post) => post.id === parseInt(id));
  const content = blogContent[id];

  if (!post) {
    return <div>Không tìm thấy bài viết</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <span className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-gray-300 space-x-4">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
      {/* Author Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center border-b border-gray-200 pb-8">
          <img
            src={post.authorImage}
            alt={post.author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <p className="text-gray-900 font-medium">{post.author}</p>
            <p className="text-gray-500 text-sm">{post.authorRole}</p>
          </div>
        </div>
      </div>
      {/* Content Section */}
      <article className="prose prose-lg max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReactMarkdown>{content.content}</ReactMarkdown>
      </article>
      {/* Tags Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
      {/* Related Posts */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <RelatedPosts currentPost={post} />
      </div>
    </div>
  );
};

export default BlogDetail;
