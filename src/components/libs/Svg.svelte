<script lang="ts">
    import regexp from "../../utils/regexp";

    export let icon: string;
    export let id: string = "";
    export let className: string = "";
    export let style: string = "";
</script>

<svg
    {style}
    data-id={id}
    class:popover__block={regexp.id.test(id)}
    class={className}
>
    <use xlink:href={icon} />
</svg>