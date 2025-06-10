import React from "react";

const Blog = () => {
  return (
    <section className="relative bg-white px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-32">
      <div className="">
        <h2 className="text-3xl leading-tight font-bold">Health Blog</h2>
        <p className="text-gray-600 mt-2 md:max-w-lg">
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas.
        </p>

        <a
          href="#"
          title=""
          className="inline-block text-teal-500 font-semibold mt-6 mt:md-0"
        >
          View All Posts
        </a>
      </div>

      <div className="md:flex mt-12 md:-mx-4">
        <div className="md:px-4 md:w-1/2 xl:w-1/4">
          <div className="bg-white rounded border border-gray-300">
            <div className="w-full h-48 overflow-hidden bg-gray-300"></div>
            <div className="p-4">
              <div className="flex items-center text-sm">
                <span className="text-teal-500 font-semibold">Business</span>
                <span className="ml-4 text-gray-600">29 Nov, 2019</span>
              </div>
              <p className="text-lg font-semibold leading-tight mt-4">
                Card Title
              </p>
              <p className="text-gray-600 mt-1">
                This card has supporting text below as a natural lead-in to
                additional content.
              </p>
              <div className="flex items-center mt-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300"></div>
                <div className="ml-4">
                  <p className="text-gray-600">
                    By{" "}
                    <span className="text-gray-900 font-semibold">
                      Abby Sims
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:px-4 md:w-1/2 xl:w-1/4 mt-4 md:mt-0">
          <div className="bg-white rounded border border-gray-300 ">
            <div className="w-full h-48 overflow-hidden bg-gray-300"></div>
            <div className="p-4">
              <div className="flex items-center text-sm">
                <span className="text-teal-500 font-semibold">Business</span>
                <span className="ml-4 text-gray-600">29 Nov, 2019</span>
              </div>
              <p className="text-lg font-semibold leading-tight mt-4">
                Card Title
              </p>
              <p className="text-gray-600 mt-1">
                This card has supporting text below as a natural lead-in to
                additional content.
              </p>
              <div className="flex items-center mt-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300"></div>
                <div className="ml-4">
                  <p className="text-gray-600">
                    By{" "}
                    <span className="text-gray-900 font-semibold">
                      Abby Sims
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
