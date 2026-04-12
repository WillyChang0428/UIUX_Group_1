# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

大家記得裝以下套件

# 一鍵安裝所有相依套件
npm install vue vue-router pinia bootstrap sass vue3-google-login @vuepic/vue-datepicker maska jwt-decode pinia-plugin-persistedstate
# 如果已有 package.json，直接執行這行即可
npm install

套件名稱	用途說明
vue-router	頁面路由管理 
pinia	全域狀態管理 (會員資料存取)
pinia-plugin-persistedstate	(必裝) 讓 Pinia 資料在頁面重整、關閉瀏覽器後依然存在
jwt-decode	(必裝) 用於解析 Google 登入回傳的加密資訊
vue3-google-login	Google 第三方登入組件
@vuepic/vue-datepicker	註冊表單使用的日曆選擇器
maska	輸入框格式限制 (如手機號碼格式化)
bootstrap & sass	UI 樣式框架與預處理器

vite原先的style.css不要用，直接用_variable.scss和main.scss設定bs

variable.scss 根據Figma設計規範去設定樣式
layout資料夾放不會隨著頁面不同而改變的重複性區塊，而隨頁面不同而切換的內容，放到views資料夾

