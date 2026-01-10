export interface GetBlogPostPageRequest {
  page: number
  size: number
  categlorySlug: string | null
}

export interface BlogTagResponse {
  name: string
  slug: string
}

export interface BlogPostInfoResponse {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  categorySlug: number[]
  status: string
  featured: boolean
  viewCount: number
  readTime: number
  publishedAt: string
  createdAt: string
  updatedAt: string
  tags: BlogTagResponse[]
}

export interface GetBlogPostBySlugRequest {
  slug: string
}

export interface BlogPostDetailResponse extends BlogPostInfoResponse {
  content: string
}

export interface BlogCategoryResponse {
  name: string
  slug: string
  description: string
  color: string
  createdAt: string
  updateAt: string
}

export interface BlogCategoryListResponse {
  categlortList: BlogCategoryResponse[]
}
