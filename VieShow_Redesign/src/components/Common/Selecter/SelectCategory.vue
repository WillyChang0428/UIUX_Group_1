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
        // 1. 等待 DOM 更新
        await nextTick();

        // 2. 找到這個 li
        const element = itemRef.value;
        // 3. 找到外層那個有捲軸的容器 (向上找 class 為 options-list 的 div)
        const container = element.closest('.options-list');

        if (container && element) {
            // 4. 計算位移：li 距離頂部的距離
            const topPos = element.offsetTop;

            // 5. 執行容器內部的捲動
            container.scrollTo({
                top: topPos,
                behavior: 'smooth' // 絲滑吸附
            });
        }
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