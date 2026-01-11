import { get } from '../http'
import type {
  Page,
  PostCategory,
  Post,
  PostList,
  PostPageQuery,
  PostTag,
} from '../types/blog'

// 分页查询博文
export const getPostPage = (params?: PostPageQuery): Promise<Page<PostList>> => {
  return get<Page<PostList>>('/blog/posts', { params })
}

// 根据slug查询单篇博文
export const getPostBySlug = (slug?: string): Promise<Post> => {
  if (!slug) throw new Error('slug 不能为空')

  return get<Post>(`/blog/posts/${slug}`)
}

// 查询分类列表
export const getCategloryList = (): Promise<PostCategory[]> => {
  return get('/blog/posts/categories')
}

// 查询标签列表
export const getTagList = (): Promise<PostTag[]> => {
  return get('/blog/posts/tags')
}
