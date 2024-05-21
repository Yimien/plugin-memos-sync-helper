<script lang="ts">
    import SettingPanel from "../libs/setting-panel.svelte";
    import {main} from "@/test";

    let groups: string[] = ["基础设置", "高级设置", "开发模式"];
    let focusGroup = groups[0];

    const BaseSettingItems: ISettingItem[] = [
        {
            type: 'textinput',
            title: '服务器地址',
            description: '支持使用域名或者IP地址',
            key: 'ServerAddr',
            value: '',
            placeholder: "请输入服务器地址，结尾不保留'/'"
        },
        {
            type: 'checkbox',
            title: 'checkbox',
            description: 'checkbox',
            key: 'a',
            value: true
        },
        {
            type: 'select',
            title: 'select',
            description: 'select',
            key: 'c',
            value: 'x',
            options: {
                x: 'x',
                y: 'y',
                z: 'z'
            }
        },
        {
            type: 'slider',
            title: 'slider',
            description: 'slider',
            key: 'd',
            value: 50,
            slider: {
                min: 0,
                max: 100,
                step: 1
            }
        },
        {
            type: 'button',
            title: 'button',
            description: 'This is a button',
            key: 'e',
            value: 'Click Button',
            button: {
                label: 'Click Me',
                callback: () => {
                    // HelloWorld();
                    main();
                    // showMessage('Hello, world!');
                }
            }
        }
    ];

    const SettingItems2: ISettingItem[] = [
        {
            type: 'checkbox',
            title: 'checkbox',
            description: 'checkbox',
            key: 'a',
            value: true
        },
        {
            type: 'textinput',
            title: 'text',
            description: 'This is a text',
            key: 'b',
            value: 'This is a text',
            placeholder: 'placeholder'
        },
        {
            type: 'select',
            title: 'select',
            description: 'select',
            key: 'c',
            value: 'x',
            options: {
                x: 'x',
                y: 'y',
                z: 'z'
            }
        },
        {
            type: 'slider',
            title: 'slider',
            description: 'slider',
            key: 'd',
            value: 50,
            slider: {
                min: 0,
                max: 100,
                step: 1
            }
        },
        {
            type: 'button',
            title: 'button',
            description: 'This is a button',
            key: 'e',
            value: 'Click Button',
            button: {
                label: 'Click Me',
                callback: () => {

                    // showMessage('Hello, world!');
                }
            }
        }
    ];

    /********** Events **********/
    interface ChangeEvent {
        group: string;
        key: string;
        value: any;
    }

    const onChanged = ({detail}: CustomEvent<ChangeEvent>) => {
        if (detail.group === groups[0]) {
            // setting.set(detail.key, detail.value);
            //Please add your code here
            //Udpate the plugins setting data, don't forget to call plugin.save() for data persistence
        }
    };
</script>

<div class="fn__flex-1 fn__flex config__panel">
    <ul class="b3-tab-bar b3-list b3-list--background">
        {#each groups as group}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
                    data-name="editor"
                    class:b3-list-item--focus={group === focusGroup}
                    class="b3-list-item"
                    on:click={() => {
                    focusGroup = group;
                }}
                    on:keydown={() => {}}
            >
                <span class="b3-list-item__text">{group}</span>
            </li>
        {/each}
    </ul>
    <div class="config__tab-wrap">
        <SettingPanel
                group={groups[0]}
                settingItems={BaseSettingItems}
                display={focusGroup === groups[0]}
                on:changed={onChanged}
                on:click={({ detail }) => { console.debug("Click:", detail.key); }}
        >
            <div class="fn__flex b3-label">
                💡 This is our default settings.
            </div>
        </SettingPanel>

        <SettingPanel
                group={groups[1]}
                settingItems={SettingItems2}
                display={focusGroup === groups[1]}
                on:changed={onChanged}
                on:click={({ detail }) => { console.debug("Click2:", detail.key); }}
        >
        </SettingPanel>
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

