/**
 * @effect_search v1.0.0
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@effect_search';

    enum Param {
        Search = 'Search',
        EffectList = 'EffectList',
    }

    enum Event {
        Search = 'Search',
    }

    /*
    *   Utility
    */
    function filter<T>(values: any[], fn: (value) => value is T): T[] {
        const arr: T[] = [];
        for (const value of values) {
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }

    /*
    *   Main
    */
    type EffectItem = { displayName: string; matchName: string; category: string; };
    const EFFECT_LIST: EffectItem[] = [];
    const EFFECT_MAP: { [matchName: string]: EffectItem } = {};

    for (let { displayName, matchName, category } of app.effects) {
        if (displayName && matchName && category) {
            const item = { displayName, matchName, category };
            EFFECT_LIST.push(item);
            EFFECT_MAP[matchName] = item;
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

    const SECTION_NAME = `@script/${SCRIPT_NAME}` as const;
    const KEY_NAME = 'recent effects';
    const RECENT_EFFECTS: EffectItem[] = loadRecentEffects();
    const MAX_RECENT_EFFECT = 30;

    function loadRecentEffects() {
        const effects: EffectItem[] = [];
        if (app.settings.haveSetting(SECTION_NAME, KEY_NAME)) {
            try {
                const matchNames = Atarabi.JSON.parse(app.settings.getSetting(SECTION_NAME, KEY_NAME)) as string[];
                for (const matchName of matchNames) {
                    if (matchName in EFFECT_MAP) {
                        effects.push(EFFECT_MAP[matchName]);
                    }
                }
            } catch (e) {
                // pass
            }
        }
        return effects;
    }

    function saveRecentEffects() {
        const matchNames: string[] = [];
        for (const item of RECENT_EFFECTS) {
            matchNames.push(item.matchName);
        }
        app.settings.saveSetting(SECTION_NAME, KEY_NAME, Atarabi.JSON.stringify(matchNames));
    }

    function appendRecentEffect(item: EffectItem) {
        for (let i = 0; i < RECENT_EFFECTS.length; i++) {
            if (RECENT_EFFECTS[i].matchName === item.matchName) {
                RECENT_EFFECTS.splice(i, 1);
                break;
            }
        }
        RECENT_EFFECTS.unshift(item);
        RECENT_EFFECTS.splice(MAX_RECENT_EFFECT);
        saveRecentEffects();
    }

    const searcher = Atarabi.UI.FuzzySearch(EFFECT_LIST, ['displayName', 'category', 'matchName'], {
        caseSensitive: false,
        sort: true,
        cache: true,
    });

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }

    function applyEffect(effectMatchName: string, move: 'beginning' | 'end' | undefined = undefined) {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return false;
        }

        const layers = filter(comp.selectedLayers.slice(), isAVLayer);
        if (!layers.length) {
            const activeLayer = Atarabi.layer.getActiveLayer();
            if (!isAVLayer(activeLayer)) {
                return false;
            }
            layers.push(activeLayer);
        }
        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: Apply`);
            for (const layer of layers) {
                const properties = layer.selectedProperties.slice();
                let selectedEffect: PropertyBase = null;
                for (const property of properties) {
                    property.selected = false;
                    if (property.isEffect) {
                        selectedEffect = property;
                        break;
                    }
                }
                const effects = layer.effect;
                if (move === 'beginning') {
                    const newEffect = effects.addProperty(effectMatchName);
                    newEffect.moveTo(1);
                    effects(1).selected = true;
                } else if (move === 'end' || !selectedEffect) {
                    const newEffect = effects.addProperty(effectMatchName);
                    newEffect.selected = true;
                } else {
                    const newIndex = selectedEffect.propertyIndex;
                    const newEffect = effects.addProperty(effectMatchName);
                    newEffect.moveTo(newIndex + 1);
                    effects(newIndex + 1).selected = true;
                }
            }
        } catch (e) {
            alert(e);
        } finally {
            app.endUndoGroup();
        }
        return true;
    };

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 2;
        win.preferredSize = [300, 300];
    })
        .addEditText(Param.Search, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.onChanging = Atarabi.app.debounce(() => {
                emitter.notify(Event.Search, ui.text);
            }, 200);
        })
        .addListBox(Param.EffectList, undefined, { numberOfColumns: 3, columnWidths: [150, 100, 50] }, (ui, emitter) => {
            type EffectListBoxItem = ListItem & { item: EffectItem };
            ui.alignment = ['fill', 'fill'];
            ui.onDoubleClick = () => {
                const selection = ui.selection as EffectListBoxItem;
                if (!selection) {
                    return;
                }
                if (applyEffect(selection.item.matchName)) {
                    appendRecentEffect(selection.item);
                }
            };
            ui.addEventListener('mousedown', (e: MouseEvent) => {
                const selection = ui.selection as EffectListBoxItem;
                if (!selection) {
                    return;
                }
                if (e.button === 2) {
                    const index = Atarabi.UI.showContextMenu([{ text: 'Move To Beginning' }, { text: 'Move To End' }]);
                    if (index === 0) {
                        if (applyEffect(selection.item.matchName, 'beginning')) {
                            appendRecentEffect(selection.item);
                        }
                    } else if (index === 1) {
                        if (applyEffect(selection.item.matchName, 'end')) {
                            appendRecentEffect(selection.item);
                        }
                    }
                }
            });

            emitter.addEventListener(Event.Search, (searchText: string) => {
                const effectItems = searchText ? searcher.search(searchText).slice(0, 50) : RECENT_EFFECTS;
                ui.removeAll();
                for (const effectItem of effectItems) {
                    try {
                        const item = ui.add('item', effectItem.displayName) as EffectListBoxItem;
                        item.subItems[0].text = effectItem.category;
                        item.subItems[1].text = effectItem.matchName;
                        item.item = effectItem;
                    } catch (e) {
                        app.setTimeout(() => {
                            emitter.notify(Event.Search, searchText);
                        }, 500);
                        return;
                    }
                }
            });
        })
        .build();

    builder.onInit(builder => {
        builder.notify(Event.Search, '');
    });

})(this);