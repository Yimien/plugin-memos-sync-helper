<!-- 面板容器 -->

<script lang="ts">
    export let display = true; // 是否显示该面板
    export let top = false; // 是否移除保留面板上下边距
    export let name = ""; // 面板名称
</script>

<div
    data-name={name}
    class:fn__none={!display}
    class:config__tab-container--top={top}
    class="config__tab-container"
>
    <slot />
</div>