<!--
    常规设置项(行级)/大型设置项(块级)
    REF: https://github.com/siyuan-note/plugin-sample-vite-svelte/blob/main/src/libs/setting-item.svelte
-->

<script lang="ts">
    //Optional
    export let title: string = ""; // Displaying Setting Title
    export let text: string = ""; // Displaying Setting Text
    export let block: boolean = false; // Using Block Style
    export let isRequired: boolean = false; // 必填项
    export let isTip: boolean = false;
    export let tipTest: string = "";
    export let isShow: boolean = true;
</script>

{#if isShow}
<label class="fn__flex b3-label">
    <div
            class="fn__flex-1"
            class:visible={block}
    >
        <slot name="title">
            <span>{@html title}</span>
            {#if isRequired}
                <span class="required">*</span>
            {/if}
        </slot>
        <div class="b3-label__text">
            <slot name="text">
                <span>{@html text}</span>
                {#if isTip}
                    <span class="required">{@html `<br>请注意：${tipTest}`}</span>
                {/if}
            </slot>
        </div>

        {#if block}
            <div class="fn__hr"/>
            <slot name="input"/>
        {/if}
    </div>

    {#if !block}
        <span class="fn__space"/>
        <slot name="input"/>
    {/if}
</label>
{/if}

<style lang="scss">
  .visible {
    overflow: visible;
  }

  .required {
    color: red;
  }
</style>