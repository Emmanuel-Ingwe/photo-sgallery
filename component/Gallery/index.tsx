"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type UnsplashImage = {
  id: string;
  imageUrl: string;
  authorName: string;
  authorImage: string;
  likeCount: number;
};

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
