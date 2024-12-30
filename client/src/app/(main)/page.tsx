"use client";

import SearchBar from "./_components/search-bar";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-24 max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold  mb-6 text-center">
          Find Your Dream Property
        </h1>

        <h2 className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-8 text-center">
          Explore the best property listings and start your journey today.
        </h2>

        <SearchBar />

        <div className="mt-12 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Why Choose Us?
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6">
            We offer an easy-to-use platform to find your perfect property
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl mb-4">🔍</h1>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Advanced Search Filters
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Easily filter listings by price, location, and more
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl mb-4">🏡</h1>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Verified Listings
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                All properties are verified for authenticity
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-4xl mb-4">💼</h1>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Verified Properties
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Our Properties are verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
