<!-- 面板组 -->

<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Svg from "@/components/libs/Svg.svelte";
    import type {ITab, TabKey} from "@/types/components/tab";

    export let panels: ITab[]; // 面板标签列表
    export let focus: TabKey; // 当前选中的面板的 key

    const dispatch = createEventDispatcher();

    function changed(key: TabKey) {
        dispatch("changed", {key});
        focus = key;
    }
</script>

<div class="fn__flex-1 fn__flex config__panel">
    <!-- 面板标签列表 -->
    <ul class="b3-tab-bar b3-list b3-list--background">
        {#each panels as panel (panel.key)}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
                    data-name={panel.text}
                    class:b3-list-item--focus={panel.key === focus}
                    class="b3-list-item"
                    on:click={() => changed(panel.key)}
                    on:keydown={() => {}}
            >
                <Svg icon={panel.icon} className="b3-list-item__graphic"/>
                <span class="b3-list-item__text">{panel.text}</span>
            </li>
        {/each}
    </ul>

    <!-- 面板主体 -->
    <div class="config__tab-wrap">
        <slot {focus}>Container</slot>
    </div>
</div>

<style lang="scss">
  .config__panel {
    height: 100%;
  }

  .config__panel > ul > li {
    padding-left: 1rem;
  }
</style>
