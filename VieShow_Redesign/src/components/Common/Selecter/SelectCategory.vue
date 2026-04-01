<script setup>
import { ref, nextTick } from 'vue' // 💡 引入 nextTick

const props = defineProps({
    label: String, // 區域名稱，如：雙北
});

const isExpanded = ref(false); // 控制該區域是否展開
const itemRef = ref(null); // 💡 建立一個 ref 綁定這個項目

const toggleExpand = async () => {
    isExpanded.value = !isExpanded.value;

    if (isExpanded.value) {
        await nextTick();

        // 💡 增加一點點延遲，確保 Transition 動態開始
        setTimeout(() => {
            const element = itemRef.value;
            const container = element.closest('.options-list');

            if (container && element) {
                // 💡 核心計算法：
                // 1. 元素相對於視窗頂部的距離
                const elementTop = element.getBoundingClientRect().top;
                // 2. 容器相對於視窗頂部的距離
                const containerTop = container.getBoundingClientRect().top;
                // 3. 目前容器已經捲動了多少
                const currentScroll = container.scrollTop;

                // 計算出該項目應該在容器內的絕對位置
                const targetPos = elementTop - containerTop + currentScroll;

                container.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        }, 100); // 💡 給 100ms 緩衝，讓動畫撐開空間
    }
};
</script>

<template>
    <li class="category-item" ref="itemRef">
        <div class="category-header" @click.stop="toggleExpand">
            <span>{{ label }}</span>
            <i :class="isExpanded ? 'fa-solid fa-angle-up' : 'fa-solid fa-angle-down'"></i>
        </div>

        <Transition name="expand">
            <ul v-if="isExpanded" class="sub-options">
                <slot></slot>
            </ul>
        </Transition>
    </li>
</template>

<style scoped lang="scss">
.category-item {
    list-style: none;

    .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: v.$white;
        cursor: pointer;
        transition: background 0.3s;
    }

    .sub-options {
        padding-left: 20px; // 💡 讓子層縮排，視覺更有層次
        background-color: rgba(0, 0, 0, 0.2); // 稍微加深底色做區隔
        overflow: hidden;

        :deep(li) {
            padding: 10px 20px;
            font-size: 0.9em;
            color: v.$vieshow-secondary;
        }
    }
}

/* 💡 讓子選單滑入滑出的動態效果 */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease-out;
    max-height: 500px; // 預設一個夠大的高度
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}
</style>