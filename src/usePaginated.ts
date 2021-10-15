import { useMemo } from "react";

const SIBLING_SIZE = 2;
const BOUNDARY_SIZE = 2;

export type UsePaginatedProps = {
  totalPage: number;
  currentPage: number;
  siblingsSize?: number;
  boundarySize?: number;
};

export type UsePaginated = (args0: UsePaginatedProps) => {
  pages: number[];
  hasPrev: boolean;
  hasNext: boolean;
  getFirstBoundary: () => number[];
  getLastBoundary: () => number[];
  isPrevTruncated: () => boolean;
  isNextTruncated: () => boolean;
};

export const usePaginated: UsePaginated = ({
  totalPage,
  currentPage,
  siblingsSize = SIBLING_SIZE,
  boundarySize = BOUNDARY_SIZE,
}) => {
  const totalPageItems = useMemo(
    () =>
      totalPage > 0
        ? Array.from(Array(totalPage), (_, pageIndex) => pageIndex + 1)
        : [],
    [totalPage]
  );
  const displayPageItemsSize = siblingsSize * 2 + 1;

  const hasReachedFirst = () => currentPage <= siblingsSize;
  const hasReachedLast = () => currentPage + siblingsSize >= totalPage;

  const calculatePages = () => {
    if (hasReachedFirst()) {
      return totalPageItems.slice(0, displayPageItemsSize);
    }
    if (hasReachedLast()) {
      return totalPageItems.slice(-displayPageItemsSize);
    }

    return totalPageItems.slice(
      currentPage - siblingsSize - 1,
      currentPage + siblingsSize
    );
  };

  const pages = calculatePages();

  const prevAllPages = totalPageItems.slice(0, pages[0] - 1);
  const nextAllPages = totalPageItems.slice(
    pages[pages.length - 1],
    totalPageItems[totalPageItems.length]
  );

  const getFirstBoundary = () => {
    if (hasReachedFirst()) {
      return [];
    }
    if (prevAllPages.length < 1) {
      return [];
    }
    const boundary = totalPageItems
      .slice(0, boundarySize)
      .filter((p) => !pages.includes(p));

    return boundary;
  };

  const getLastBoundary = () => {
    if (hasReachedLast()) {
      return [];
    }
    if (nextAllPages.length < 1) {
      return [];
    }
    const boundary = totalPageItems
      .slice(totalPageItems.length - boundarySize, totalPageItems.length)
      .filter((p) => !pages.includes(p));
    return boundary;
  };

  const isPrevTruncated = () =>
    prevAllPages.filter(
      (p) => !getFirstBoundary().includes(p) && !pages.includes(p)
    ).length > 0;
  const isNextTruncated = () =>
    nextAllPages.filter(
      (p) => !getLastBoundary().includes(p) && !pages.includes(p)
    ).length > 0;

  return {
    pages,
    hasPrev: currentPage > 1,
    hasNext: totalPage > currentPage,
    getFirstBoundary,
    getLastBoundary,
    isPrevTruncated,
    isNextTruncated,
    totalPage,
    currentPage,
  };
};
