<script lang="ts">
    import regexp from "@/utils/misc/regexp";

    export let icon: string;
    export let id: string = "";
    export let className: string = "";
    export let style: string = "";
</script>

<svg
        class={className}
        class:popover__block={regexp.id.test(id)}
        data-id={id}
        {style}
>
    <use xlink:href={icon}/>
</svg>