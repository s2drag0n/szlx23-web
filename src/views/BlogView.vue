<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash-es'
import { type PostCategory, type PostTag, type PostPageQuery, type PostList } from '@/api/types/blog';
import { getCategloryList, getPostPage, getTagList } from '@/api/modules/blog';
import { formatDate } from '@/api/utils/format';

const categories = ref<PostCategory[]>([])
const loadingCategories = ref(false)
const errorCategories = ref<string | null>(null)

const selectedCategory = ref<string>('')

const tags = ref<PostTag[]>([])
const loadingTags = ref(false)
const errorTags = ref<string | null>(null)

const selectedTags = ref<string[]>([])

const posts = ref<PostList[]>([])
const loadingPosts = ref(false)
const errorPosts = ref<string | null>(null)

const keyword = ref<string>('')

// 使用 lodash 的 debounce，等待 300 毫秒没有新输入时再触发
const handleSearch = debounce(() => {
  searchPosts()
}, 300)

/** 加载分类函数 */
async function loadCategories() {
  loadingCategories.value = true
  errorCategories.value = null
  try {
    categories.value = await getCategloryList()
  } catch (err) {
    console.error(err)
    errorCategories.value = '加载分类失败'
  } finally {
    loadingCategories.value = false
  }
}

/** 监听分类选择 */
watch(selectedCategory, () => {
  searchPosts()
})

/** 加载标签函数 */
async function loadTags() {
  loadingTags.value = true
  errorTags.value = null
  try {
    tags.value = await getTagList()
  } catch (err) {
    console.error(err)
    errorTags.value = '加载标签失败'
  } finally {
    loadingTags.value = false
  }
}

/** 标签切换函数 */
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  searchPosts()
}

/** 组装查询参数 */
const postPageParams = computed<PostPageQuery>(() => ({
  page: 0,
  size: 10,
  categorySlug: selectedCategory.value,
  tagSlugs: selectedTags.value,
  keyword: keyword.value
}))

/** 搜索博文函数 */
async function searchPosts() {
  loadingPosts.value = true
  errorPosts.value = null
  try {
    const postPage = await getPostPage(postPageParams.value)
    posts.value = postPage.content
  } catch (error) {
    console.error(error)
    errorPosts.value = '加载博文失败'
  } finally {
    loadingPosts.value = false
  }
}

// 页面挂载时调用
onMounted(() => {
  loadCategories()
  loadTags()
  searchPosts()
})

</script>

<template>
  <div class="blog-view">
    <!-- Header Section -->
    <div class="blog-header">
      <!-- Search Bar -->
      <div class="search-section">
        <input v-model="keyword" type="text" class="search-input" placeholder="搜索文章内容、分类或标签..." @input="handleSearch" />
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </div>

      <!-- Filter Controls -->
      <div class="filter-controls">
        <!-- Category Dropdown -->
        <div class="category-filter">
          <select v-model="selectedCategory" class="category-select">
            <option value="">所有分类</option>
            <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Tag Cloud -->
        <div class="tag-cloud">
          <span v-for="tag in tags" :key="tag.slug" :class="['tag', { active: selectedTags.includes(tag.slug) }]"
            @click="toggleTag(tag.slug)">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div class="posts-container">
      <div v-if="posts.length === 0" class="empty-state">
        <p>暂无文章</p>
      </div>

      <article v-for="post in posts" :key="post.slug" class="post-card">
        <div class="post-image">
          <img :src="post.coverImage" :alt="post.title" />
        </div>

        <div class="post-content">
          <div class="post-header">
            <h3 class="post-title">{{ post.title }}</h3>
            <time class="post-date">{{ formatDate(post.publishedTime) }}</time>
          </div>

          <p class="post-excerpt">{{ post.excerpt }}</p>

          <div class="post-meta">
            <span class="post-category">{{ post.categoryName }}</span>
            <div class="post-tags">
              <span v-for="tagName in post.tagNames" :key="tagName" class="post-tag"> #{{ tagName }} </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.blog-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.blog-header {
  margin-bottom: 3rem;
}

.blog-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1a1a1a;
}

/* Search Section */
.search-section {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

/* Filter Controls */
.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-filter {
  flex-shrink: 0;
}

.category-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
}

.category-select:hover {
  border-color: #0066cc;
}

.category-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Tag Cloud */
.tag-cloud {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
  color: #666;
  white-space: nowrap;
}

.tag:hover {
  border-color: #0066cc;
  color: #0066cc;
}

.tag.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

/* Posts Container */
.posts-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(700px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #999;
}

/* Post Card */
.post-card {
  display: flex;
  gap: 1.25rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  background-color: white;
}

.post-card:hover {
  border-color: #0066cc;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}

.post-image {
  flex-shrink: 0;
  width: 180px;
  height: 140px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  flex: 1;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.post-header {
  margin-bottom: 0.75rem;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  line-height: 1.4;
}

.post-date {
  font-size: 0.8rem;
  color: #999;
}

.post-excerpt {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  flex: 1;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.post-category {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #0066cc;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  font-size: 0.75rem;
  color: #999;
}

/* Responsive */
@media (max-width: 768px) {
  .blog-header {
    margin-bottom: 2rem;
  }

  .filter-controls {
    gap: 0.5rem;
  }

  .posts-container {
    grid-template-columns: 1fr;
  }

  .post-card {
    flex-direction: column;
  }

  .post-image {
    width: 100%;
    height: 200px;
  }
}
</style>
