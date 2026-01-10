<template>
  <nav class="responsive-nav">
    <div class="nav-container">
      <div class="nav-logo">
        <router-link to="/" class="logo-link">
          <h2>MySite</h2>
        </router-link>
      </div>

      <div class="nav-links" :class="{ 'nav-links-active': isMobileMenuOpen }">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          @click="closeMobileMenu"
          :class="{
            active: isActive(item.path),
            'exact-active': $route.path === item.path,
          }"
        >
          {{ item.title }}
        </router-link>
      </div>

      <div class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="切换菜单">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// 定义菜单项类型
interface MenuItem {
  title: string
  path: string
  requiresAuth?: boolean
}

// 响应式数据
const isMobileMenuOpen = ref(false)
const route = useRoute()

// 菜单数据
const menuItems: MenuItem[] = [{ title: '文章', path: '/blog' }]

// 检查当前路由是否激活
const isActive = (path: string): boolean => {
  return (route.path.startsWith(path) && path !== '/') || route.path === path
}

// 方法
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false
}

const handleResize = (): void => {
  if (window.innerWidth > 768) {
    isMobileMenuOpen.value = false
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 暴露给模板
defineExpose({
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
})
</script>

<style scoped lang="scss">
.responsive-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 70px;
}

.nav-logo {
  .logo-link {
    text-decoration: none;
    color: inherit;

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.nav-links {
  display: flex;
  gap: 1rem;

  @media (min-width: 769px) {
    gap: 2rem;
  }
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: white;
      border-radius: 1px;
    }
  }

  &.exact-active {
    background: rgba(255, 255, 255, 0.25);
    font-weight: 600;
  }
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    width: 20px;
    height: 2px;
    background: white;
    margin: 2px 0;
    transition: all 0.3s ease;
    transform-origin: center;
  }
}

// 移动端样式
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .mobile-menu-btn {
    display: flex;

    // 汉堡菜单动画
    &.nav-links-active span {
      &:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: inherit;
    flex-direction: column;
    padding: 1rem;
    display: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &.nav-links-active {
      display: flex;
      animation: slideDown 0.3s ease;
    }

    .nav-link {
      text-align: center;
      padding: 1rem;
      margin: 0.25rem 0;
      border-radius: 8px;

      &.active::after {
        display: none;
      }
    }
  }
}

// 动画
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
