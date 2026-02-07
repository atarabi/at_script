/**
 * @note_manager v1.0.0
 * 
 *      v1.0.0(2026/02/07) Initial release
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@note_manager';

    const Param = {
        ToolGroup: 'Tool Group',
        Search: 'Search',
        Checked: 'Checked',
        Refresh: 'Refresh',
        List: 'List',
        Body: 'Body',
    } as const;

    const Event = {
        Refresh: 'Refresh',
        Update: 'Update',
    } as const;

    const enum Column {
        Subject = -1,
        Body,
        Comp,
        Layer,
        Effect,
        $,
        Total,
    }

    /*
    *   Utility
    */
    const debounce = (callback: () => void, delay: number) => {
        let timer: number = -1;
        return () => {
            app.cancelTimeout(timer);
            timer = app.setTimeout(callback, delay);
        };
    };

    const filter = <T extends any>(arr: T[], cond: (item: T) => boolean): T[] => {
        const reuslt: T[] = [];
        for (const item of arr) {
            if (cond(item)) {
                reuslt.push(item);
            }
        }
        return reuslt;
    };

    const isAVLayer = (layer: Layer): layer is AVLayer => {
        return layer instanceof AVLayer || layer instanceof ShapeLayer || layer instanceof TextLayer;
    };

    const forEachComp = (fn: (comp: CompItem) => void) => {
        for (let i = 1, len = app.project.numItems; i <= len; i++) {
            const item = app.project.item(i);
            if (item instanceof CompItem) {
                fn(item);
            }
        }
    };

    const deselectLayers = (comp: CompItem) => {
        const layers = comp.selectedLayers.slice();
        for (const layer of layers) {
            layer.selected = false;
        }
    };

    const deselectProperties = (layer: Layer) => {
        const properties = layer.selectedProperties.slice();
        for (const property of properties) {
            property.selected = false;
        }
    };

    type NoteInfo = {
        comp: {
            instance: CompItem;
            name: string;
        };
        layer: {
            instance: AVLayer;
            name: string;
        };
        effect: {
            instance: PropertyGroup;
            name: string;
            index: number;
        };
        time?: number;
        key?: number;
        value: Atarabi.At.NoteValue;
    };

    const noteInfos: NoteInfo[] = [];

    const searcher = Atarabi.UI.FuzzySearch(noteInfos, ['value.subject', 'value.body'], { caseSensitive: false });

    const AT_NOTE_MATCH_NAME = 'Atarabi_note';

    const AT_NOTE_PROPERTY_MATCH_NAME = 'Atarabi_note-0001';

    const validateNoteInfo = (info: NoteInfo) => {
        if (isValid(info.effect.instance)) {
            return true;
        }
        if (isValid(info.layer.instance)) {
            const effects = info.layer.instance.effect;
            if (info.effect.index > effects.numProperties) {
                return false;
            }
            const effect = effects(info.effect.index) as PropertyGroup;
            if (effect.matchName === AT_NOTE_MATCH_NAME && effect.name === info.effect.name) {
                info.effect.instance = effect;
                return true;
            }
        }
        return false;
    };

    const refreshNoteInfos = () => {
        noteInfos.splice(0);
        forEachComp(comp => {
            for (let i = 1, len = comp.numLayers; i <= len; i++) {
                const layer = comp.layer(i);
                if (!isAVLayer(layer)) {
                    continue;
                }
                const effects = layer.effect;
                for (let j = 1, len = effects.numProperties; j <= len; j++) {
                    const effect = effects(j) as PropertyGroup;
                    if (effect.matchName !== AT_NOTE_MATCH_NAME) {
                        continue;
                    }
                    const property = effect(AT_NOTE_PROPERTY_MATCH_NAME) as Property;
                    const numKeys = property.numKeys;
                    if (numKeys > 0) {
                        for (let k = 1; k <= numKeys; k++) {
                            const time = property.keyTime(k);
                            const value = Atarabi.at.getNoteValueAtKey(property, k);
                            noteInfos.push({
                                comp: {
                                    instance: comp,
                                    name: comp.name,
                                },
                                layer: {
                                    instance: layer,
                                    name: layer.name,
                                },
                                effect: {
                                    instance: effect,
                                    name: effect.name,
                                    index: effect.propertyIndex,
                                },
                                time,
                                key: k,
                                value,
                            });
                        }
                    } else {
                        const value = Atarabi.at.getNoteValue(property);
                        noteInfos.push({
                            comp: {
                                instance: comp,
                                name: comp.name,
                            },
                            layer: {
                                instance: layer,
                                name: layer.name,
                            },
                            effect: {
                                instance: effect,
                                name: effect.name,
                                index: effect.propertyIndex,
                            },
                            value,
                        });
                    }
                }
            }
        });
    };

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = 2;
        win.margins = 3;
        win.preferredSize = [640, 300];
    })
        .addGroup(Param.ToolGroup, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
        })
        .addEditText(Param.Search, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'fill'];
            ui.onChanging = debounce(() => {
                emitter.notify(Event.Refresh);
            }, 200);
        })
        .addCheckbox(Param.Checked, true, '', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize[0] = 20;
            ui.justify = 'center';
            ui.onClick = () => {
                emitter.notify(Event.Refresh, false);
            };
        })
        .addButton(Param.Refresh, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize[0] = 70;
            ui.onClick = () => {
                emitter.notify(Event.Refresh, true);
            };
        })
        .addGroupEnd()
        .addListBox(Param.List, undefined, { showHeaders: true, numberOfColumns: Column.Total, columnTitles: ['Subject', 'Body', 'Comp', 'Layer', 'Effect'], columnWidths: [120, 120, 120, 120, 120] }, (ui, emitter) => {
            type ListItemWithInfo = ListItem & { info: NoteInfo };
            ui.alignment = ['fill', 'top'];
            ui.minimumSize[1] = 80;
            ui.preferredSize[1] = 100;
            emitter.addEventListener(Event.Refresh, (force: boolean = false) => {
                if (force) {
                    refreshNoteInfos();
                }
                const searchText = builder.get(Param.Search);
                let infos = searchText ? searcher.search(searchText) : noteInfos;
                const isChecked = builder.get(Param.Checked);
                if (isChecked) {
                    infos = filter(infos, info => info.value.checked);
                }
                ui.removeAll();
                for (const info of infos) {
                    const item = ui.add('item', info.value.subject) as ListItemWithInfo;
                    item.subItems[Column.Body].text = info.value.body.slice(0, 20).replace(/\n/g, ' ');
                    item.subItems[Column.Comp].text = info.comp.name;
                    item.subItems[Column.Layer].text = info.layer.name;
                    item.subItems[Column.Effect].text = info.effect.name;
                    item.info = info;
                }
            });
            ui.onChange = () => {
                const selection = ui.selection as ListItemWithInfo;
                if (!selection) {
                    emitter.notify(Event.Update, '');
                    return;
                }
                emitter.notify(Event.Update, selection.info.value.body);
            };
            ui.onDoubleClick = () => {
                const selection = ui.selection as ListItemWithInfo;
                if (!selection) {
                    return;
                }
                const info = selection.info;
                if (!validateNoteInfo(info)) {
                    alert('invalid: Please refresh');
                    return;
                }
                info.comp.instance.openInViewer();
                if (typeof info.time === 'number') {
                    info.comp.instance.time = info.time;
                }
                deselectLayers(info.comp.instance);
                info.layer.instance.selected = true;
                deselectProperties(info.layer.instance);
                info.effect.instance.selected = true;
            };
        })
        .addEditText(Param.Body, undefined, { multiline: true }, (ui, emitter) => {
            ui.alignment = ['fill', 'fill'];
            ui.minimumSize[1] = 100;
            ui.preferredSize[1] = 120;

            emitter.addEventListener(Event.Update, (body: string) => {
                ui.text = body;
            });
        })
        .build();


})(this);