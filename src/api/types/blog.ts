import type { PageQuery } from "./general"

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PostList {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  viewCount: number
  readTime: number
  publishTime: string
  categoryName: string
  tagNames: string[]
}

export interface PostPageQuery extends PageQuery{
  categorySlug: string
  tagSlugs: string[]
  keyword: string
}

export interface Post extends PostList {
  content: string
}

export interface PostCategory {
  id: string
  name: string
  slug: string
  postCount: number
}

export interface PostTag {
  id: string
  name: string
  slug: string
  postCount: number
}
