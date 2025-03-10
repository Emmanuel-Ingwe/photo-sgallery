"use client";

import React, { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

type UnsplashImage = {
  id: string;
  imageUrl: string;
  authorName: string;
  authorImage: string;
  likeCount: number;
};

const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

const fetchImages = async ({
  queryKey,
  pageParam = 1,
}: {
  queryKey: string[];
  pageParam?: number;
}) => {
  const [, query] = queryKey;
  const endpoint = query
    ? `https://api.unsplash.com/search/photos?query=${query}&page=${pageParam}&per_page=15&client_id=${ACCESS_KEY}`
    : `https://api.unsplash.com/photos?page=${pageParam}&per_page=15&client_id=${ACCESS_KEY}`;

  const res = await fetch(endpoint);

  if (!res.ok) {
    throw new Error("couldn't fetch images");
  }

  const data = await res.json();

  return query
    ? data.results.map(
        (img: {
          id: string;
          urls: { small: string };
          user: { name: string; profile_image: { medium: string } };
          likes: number;
        }) => ({
          id: img.id,
          imageUrl: img.urls.small || "",
          authorName: img.user?.name || "Unknown",
          authorImage: img.user?.profile_image?.medium || "",
          likeCount: img.likes || 0,
        })
      )
    : data.map(
        (img: {
          id: string;
          urls: { small: string };
          user: { name: string; profile_image: { medium: string } };
          likes: number;
        }) => ({
          id: img.id,
          imageUrl: img.urls.small || "",
          authorName: img.user?.name || "Unknown",
          authorImage: img.user?.profile_image?.medium || "",
          likeCount: img.likes || 0,
        })
      );
};

const UnsplashGallery: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["images", debouncedQuery],
    queryFn: async ({ queryKey, pageParam }) => {
      return await fetchImages({ queryKey, pageParam });
    },
    getNextPageParam: (_lastPage, allPages) => allPages.length + 1,
    initialPageParam: 1,
    enabled: true,
  });

  const images = data?.pages.flat() || [];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full xl:w-[1100px] mx-auto p-6 bg-gray-100">
      <div className="flex justify-between my-20 items-center">
        <div className={pacifico.className}>
          <h1 className="text-2xl font-extrabold">PhotoSearch.</h1>
        </div>
        <p>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="w-full gap-4 my-4 flex">
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-1 rounded-md border outline-blue-600 bg-white border-gray-300 w-full"
        />
        <button
          type="submit"
          className="px-4 cursor-pointer py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Search
        </button>
      </form>

      <h2 className="text-2xl py-3 mt-10">
        Showing results for {".."}
        <span className="font-bold font-serif underline">
          {debouncedQuery || " "}
        </span>
      </h2>

      {/* Loading & Error */}
      {isFetching && !isFetchingNextPage && (
        <p className="text-center py-4">Loading...</p>
      )}
      {error && (
        <p className="text-center text-red-500 py-4">
          {(error as unknown as Error).message}
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image: UnsplashImage) => (
          <div
            key={image.id}
            className="w-full bg-gray-100 rounded-2xl shadow mx-auto relative">
            {/* Image */}
            <Image
              src={image.imageUrl}
              alt={image.authorName}
              unoptimized
              width={500}
              height={300}
              className="w-full rounded-t-2xl h-56 object-cover"
            />

            <div className="absolute top-3 right-3 bg-white bg-opacity-75 text-black px-2 py-1 rounded-full text-xs">
              ❤️ {image.likeCount}
            </div>

            {/* Author */}
            <div className="p-4">
              <div className="flex justify-between items-center gap-4">
                <div className="border-2 rounded-full">
                  <Image
                    src={image.authorImage}
                    alt={image.authorName}
                    width={40}
                    height={40}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm">{image.authorName}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center font-bold text-sm mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className={`px-2 cursor-pointer py-1 rounded-md border border-gray-300 ${
              isFetchingNextPage
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white text-black hover:bg-blue-600"
            }`}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <div className="text-center mt-8 text-gray-500 font-bold">
        <div className={pacifico.className}>
          &copy; 2025 ❤️ by Emmanuel Ingwe
        </div>
      </div>
    </div>
  );
};

export default UnsplashGallery;
