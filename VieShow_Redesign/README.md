# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

大家記得裝以下套件

npm install vite@latest vue-router pinia bootstrap -D sass vue3-google-login

vite原先的style.css不要用，直接用_variable.scss和main.scss設定bs

variable.scss 根據Figma設計規範去設定樣式
layout資料夾放不會隨著頁面不同而改變的重複性區塊，而隨頁面不同而切換的內容，放到views資料夾

