/**
 * @effect_launcher v1.0.0
 */
(() => {

    type EffectItem = { displayName: string; matchName: string; category: string; };
    const EFFECT_LIST: EffectItem[] = [];
    const RECENT_NUM = 50;
    const RECENT_EFFECT_LIST: EffectItem[] = [];

    for (let { displayName, matchName, category } of app.effects) {
        if (displayName && matchName && category) {
            const item = { displayName, matchName, category };
            EFFECT_LIST.push(item);
        }
    }

    EFFECT_LIST.sort((a, b) => {
        const aObsolete = a.category === '_Obsolete';
        const bObsolete = b.category === '_Obsolete';
        if (aObsolete === bObsolete) {
            return 0;
        } else if (aObsolete) {
            return 1;
        } else {
            return -1;
        }
    });

    const searcher = Atarabi.UI.FuzzySearch(EFFECT_LIST, ['displayName', 'category', 'matchName'], {
        caseSensitive: false,
        sort: true,
        cache: true,
    });

    const isAVLayer = (layer: Layer): layer is AVLayer => {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    };

    const getActiveAVLayers = (): AVLayer[] => {
        const avLayers: AVLayer[] = [];
        const activeLayer = Atarabi.layer.getActiveLayer();
        const comp = activeLayer ? activeLayer.containingComp : Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            for (const layer of comp.selectedLayers) {
                if (isAVLayer(layer)) {
                    avLayers.push(layer);
                }
            }
        }
        return avLayers;
    };

    const mod = (x: number, y: number) => {
        const z = x % y;
        return z < 0 ? z + y : z;
    };

    let isLock = false;

    Atarabi.keyboard.hook({ code: 'Space', ctrlOrCmdKey: true }, ctx => {
        if (isLock) {
            return false;
        }
        const avLayers = getActiveAVLayers();
        if (!avLayers.length) {
            return false;
        }

        isLock = true;

        const win = new Window('dialog', undefined, undefined, { borderless: true });
        win.spacing = 0;
        win.margins = 0;
        win.preferredSize = [350, 200];

        const searchbox = win.add('edittext');
        searchbox.alignment = ['fill', 'top'];
        searchbox.onChanging = Atarabi.app.debounce(() => {
            updateList(searchbox.text);
        }, 200);
        searchbox.addEventListener('keydown', (ev: KeyboardEvent) => {
            switch (ev.keyName) {
                case 'Up':
                    moveList(-1);
                    break;
                case 'Down':
                    moveList(1);
                    break;
                case 'Enter':
                    apply();
                    break;
            }
        });

        type EffectListBoxItem = ListItem & { item: EffectItem };
        const effectList = win.add('listbox', undefined, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 100] });
        effectList.alignment = ['fill', 'fill'];
        effectList.onDoubleClick = () => {
            apply();
        }
        if (RECENT_EFFECT_LIST.length) {
            updateList('');
        }

        function moveList(offset: number) {
            const selection = effectList.selection as EffectListBoxItem;
            if (!selection) {
                if (effectList.items.length) {
                    effectList.selection = 0;
                }
                return;
            }
            effectList.selection = mod(selection.index + offset, effectList.items.length);
        }

        function updateList(searchText: string) {
            const effectItems = searchText ? searcher.search(searchText).slice(0, 50) : RECENT_EFFECT_LIST;
            effectList.removeAll();
            for (let i = 0, total = effectItems.length; i < total; i++) {
                const effectItem = effectItems[i];
                const item = effectList.add('item', effectItem.displayName) as EffectListBoxItem;
                item.subItems[0].text = effectItem.category;
                item.subItems[1].text = effectItem.matchName;
                item.item = effectItem;
            }
            if (effectList.items.length) {
                effectList.selection = 0;
            }
        }

        function updateRecent(item: EffectItem) {
            let found = false;
            for (let i = 0, total = RECENT_EFFECT_LIST.length; i < total; i++) {
                const it = RECENT_EFFECT_LIST[i];
                if (it.matchName === item.matchName) {
                    found = true;
                    if (i != 0) {
                        RECENT_EFFECT_LIST.splice(i, 1);
                        RECENT_EFFECT_LIST.unshift(item);
                    }
                    break;
                }
            }
            if (!found) {
                RECENT_EFFECT_LIST.unshift(item);
            }
            if (RECENT_EFFECT_LIST.length > RECENT_NUM) {
                RECENT_EFFECT_LIST.length = RECENT_NUM;
            }
        }

        function apply() {
            let selection = effectList.selection as EffectListBoxItem;
            if (!selection && effectList.items.length === 1) {
                selection = effectList.items[0] as EffectListBoxItem;
            }
            if (!selection) {
                win.close();
                return;
            }
            const item = selection.item;
            updateRecent(item);
            const matchName = item.matchName;
            try {
                app.beginUndoGroup(`Apply: ${item.displayName}`)
                for (const avLayer of avLayers) {
                    avLayer.effect.addProperty(matchName);
                }
            } catch (e) {
                // pass
            } finally {
                app.endUndoGroup();
            }
            win.close();
        }

        win.onShow = () => {
            searchbox.active = true;
        };
        win.location = [ctx.mousePosition.x, ctx.mousePosition.y];
        win.show();

        isLock = false;

        return true;
    });

})();