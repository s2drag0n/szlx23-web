import type { AxiosResponse } from 'axios'

import type {
  BlogCategoryListResponse as BlogCategoryListResponse,
  BlogPostDetailResponse,
  BlogPostInfoResponse,
  GetBlogPostBySlugRequest,
  GetBlogPostPageRequest,
} from '../types/blog'
import { http, type ApiResponse } from '../http'

// 分页查询博文
export const getBlogPostPage = async (
  params?: GetBlogPostPageRequest,
): Promise<BlogPostInfoResponse> => {
  const response: AxiosResponse<ApiResponse<BlogPostInfoResponse>> = await http.get('/blog/posts', {
    params,
  })

  return response.data.data
}

// 根据slug查询单篇博文
export const getBlogPostBySlug = async (
  params?: GetBlogPostBySlugRequest,
): Promise<BlogPostDetailResponse> => {
  const slug = params?.slug
  if (!slug) throw new Error('slug 不能为空')

  const response: AxiosResponse<ApiResponse<BlogPostDetailResponse>> = await http.get(
    `/blog/posts/${slug}`,
  )

  console.log(response)

  return response.data.data
}

// 查询分类列表
export const getCategloryList = async (): Promise<BlogCategoryListResponse> => {
  const response: AxiosResponse<ApiResponse<BlogCategoryListResponse>> =
    await http.get('/blog/categories')
  return response.data.data
}
