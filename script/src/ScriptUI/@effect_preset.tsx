/**
 * @effect_preset v1.0.0
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@effect_preset';

    enum Param {
        ToolGroup = 'Tool',
        Search = 'Search',
        Add = 'Add',
        Remove = 'Remove',
        Up = 'Up',
        Down = 'Down',
        PresetList = 'PresetList',
    }

    enum Event {
        SearchChanging = 'SearchChanging',
        Add = 'Add',
        Remove = 'Remove',
        Up = 'Up',
        Down = 'Down',
        Refresh = 'Refresh',
        Save = 'Save',
    }

    /*
    *   Utility
    */
    function filter<T>(values: any[], fn: (value: any) => value is T): T[] {
        const arr: T[] = [];
        for (const value of values) {
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }

    function map<T, U>(array: T[], fn: (value: T, index: number, array: T[]) => U): U[] {
        const result: U[] = [];
        for (let i = 0; i < array.length; i++) {
            result.push(fn(array[i], i, array));
        }
        return result;
    }

    /*
    *   Main
    */
    type PropertyValueItem = { value: Atarabi.ValueType; time: number; params?: Atarabi.KeyParameters; };
    type PropertyItem = { name: string; matchName: string; expression?: string; value?: Atarabi.ValueType; values?: PropertyValueItem[]; };
    type EffectItem = { name: string; matchName: string; enabled: boolean; properties?: PropertyItem[] };
    type PresetItem = { name: string; description: string; effects: EffectItem[]; };
    type Preset = {
        type: '@scripts/@effect_preset';
        version: 1;
        presets: PresetItem[];
        createdAt: string;
        updatedAt: string;
    };

    const PRESET_FOLDER = new Folder(`${Folder.userData.absoluteURI}/Atarabi/@scripts/${SCRIPT_NAME}`);
    const PRESET_FILE = new File(`${PRESET_FOLDER.absoluteURI}/preset.json`);

    function createFolder(folder: Folder) {
        if (folder.exists) {
            return;
        }
        const parents: Folder[] = [];
        let parent: Folder = folder;
        while (!(parent && parent.exists)) {
            parents.push(parent);
            parent = parent.parent;
        }
        parents.reverse();
        for (const folder of parents) {
            folder.create();
        }
    }

    function loadPreset(file: File) {
        let preset: Preset = { type: '@scripts/@effect_preset', version: 1, presets: [], createdAt: new Date().toLocaleString(), updatedAt: new Date().toLocaleString() };
        if (file.exists) {
            try {
                file.encoding = 'utf-8';
                if (!file.open('r')) {
                    return preset;
                }
                const data = file.read();
                file.close();
                preset = Atarabi.JSON.parse(data);
            } catch (e) {
                alert(e);
            }
        }
        return preset;
    }

    function savePreset(file: File, preset: Preset) {
        createFolder(file.parent);
        file.encoding = 'utf-8';
        if (!file.open('w')) {
            alert(`Unable to open ${file.displayName}`);
            return;
        }
        file.write(Atarabi.JSON.stringify(preset, undefined, 2));
        file.close();
    }

    const PRESET: Preset = loadPreset(PRESET_FILE);

    const searcher = Atarabi.UI.FuzzySearch(PRESET.presets, ['name', 'description'], {
        caseSensitive: false,
        sort: true,
    });

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }

    // black list
    const INVALID_CUSTOM_VALUES: { [matchName: string]: boolean; } = {
        'ADBE MESH WARP-0004': true,
        'ADBE RESHAPE-0006': true,
    };

    function isValidProperty(property: Property) {
        switch (property.propertyValueType) {
            case PropertyValueType.ThreeD_SPATIAL:
            case PropertyValueType.ThreeD:
            case PropertyValueType.TwoD_SPATIAL:
            case PropertyValueType.TwoD:
            case PropertyValueType.OneD:
            case PropertyValueType.COLOR:
                return true;
            case PropertyValueType.CUSTOM_VALUE:
                return INVALID_CUSTOM_VALUES[property.matchName] ? false : true;
        }
        return false;
    }

    function transformValue(layer: AVLayer, property: Property, value: Atarabi.ValueType, forward: boolean = true): Atarabi.ValueType {
        switch (property.propertyValueType) {
            case PropertyValueType.ThreeD_SPATIAL:
                if (forward) {
                    return [value[0] / layer.width * 100, value[1] / layer.height * 100, value[2] / layer.height * 100];
                } else {
                    return [value[0] * layer.width / 100, value[1] * layer.height / 100, value[2] * layer.height / 100];
                }
            case PropertyValueType.TwoD_SPATIAL:
                if (forward) {
                    return [value[0] / layer.width * 100, value[1] / layer.height * 100];
                } else {
                    return [value[0] * layer.width / 100, value[1] * layer.height / 100];
                }
        }
        return value;
    }

    function createPreset(): PresetItem | null {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        const layers = comp.selectedLayers.slice();
        if (!layers.length) {
            return null;
        }
        const layer = layers[0];
        if (!isAVLayer(layer)) {
            return null;
        }
        const effectItems: EffectItem[] = [];
        const effects = layer.effect;
        for (let i = 1; i <= effects.numProperties; i++) {
            const effect = effects(i) as PropertyGroup;
            if (!effect.selected) {
                continue;
            }
            const effectItem: EffectItem = { name: effect.name, matchName: effect.matchName, enabled: effect.enabled };
            for (let j = 1; j <= effect.numProperties; j++) {
                const property = effect(j) as Property;
                let expression = '';
                if (property.canSetExpression && property.expressionEnabled) {
                    expression = Atarabi.property.getExpression(property);
                }
                let value: Atarabi.ValueType = null, values: PropertyValueItem[] = null;
                if (isValidProperty(property)) {
                    if (property.numKeys > 0) {
                        values = [];
                        for (let k = 1; k <= property.numKeys; k++) {
                            const time = property.keyTime(k) - layer.time;
                            const value = transformValue(layer, property, Atarabi.property.getValueAtKey(property, k));
                            const params = Atarabi.property.getKeyParameters(property, k);
                            values.push({ time, value, params });
                        }
                    } else {
                        if (Atarabi.property.isModified(property)) {
                            value = transformValue(layer, property, Atarabi.property.getValue(property, { preExpression: true }));
                        }
                    }
                }
                if (expression || value != null || values != null) {
                    const propertyItem: PropertyItem = { name: property.name, matchName: property.matchName };
                    if (expression) {
                        propertyItem.expression = expression;
                    }
                    if (value !== null) {
                        propertyItem.value = value;
                    }
                    if (values !== null) {
                        propertyItem.values = values;
                    }
                    if (!effectItem.properties) {
                        effectItem.properties = [];
                    }
                    effectItem.properties.push(propertyItem);
                }
            }
            effectItems.push(effectItem);
        }
        if (!effectItems.length) {
            return null;
        }

        let name = map(effectItems, item => item.name).join(' / ');
        do {
            name = prompt('Input a preset name', name, SCRIPT_NAME);
            if (name === null) {
                return null;
            }
        } while (!name);

        let description = prompt('Input a description', '', SCRIPT_NAME);
        if (description === null) {
            return null;
        }

        return { name, description, effects: effectItems };
    }

    function deselectLayers(comp: CompItem) {
        const layers = comp.selectedLayers.slice();
        for (const layer of layers) {
            layer.selected = false;
        }
    }

    function applyPropertyItems(layer: AVLayer, effect: PropertyGroup, propertyItem: PropertyItem) {
        const property = effect(propertyItem.matchName) as Property;
        if (propertyItem.value != null) {
            Atarabi.property.setValue(property, transformValue(layer, property, propertyItem.value, false));
        }
        if (propertyItem.values != null) {
            for (const { time, value } of propertyItem.values) {
                Atarabi.property.setValue(property, transformValue(layer, property, value, false), { time: time + layer.time, key: true });
            }
            for (let k = 0, total = propertyItem.values.length; k < total; k++) {
                const value = propertyItem.values[k];
                if (value.params) {
                    Atarabi.property.setKeyParameters(property, k + 1, value.params);
                }
            }
        }
        if (propertyItem.expression) {
            Atarabi.property.setExpression(property, propertyItem.expression);
        }
    }

    function applyPreset(preset: PresetItem) {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return;
        }

        const selectedLayers = comp.selectedLayers.slice();
        const layers = filter(selectedLayers, isAVLayer);
        if (!layers.length) {
            const activeLayer = Atarabi.layer.getActiveLayer();
            if (!isAVLayer(activeLayer)) {
                return;
            }
            layers.push(activeLayer);
        }
        try {
            app.beginUndoGroup(`${SCRIPT_NAME}: Apply "${preset.name}"`);
            for (const layer of layers) {
                deselectLayers(comp);
                layer.selected = true;
                const effects = layer.effect;
                for (const effectItem of preset.effects) {
                    if (!effects.canAddProperty(effectItem.matchName)) {
                        continue;
                    }
                    const effect = effects.addProperty(effectItem.matchName) as PropertyGroup;
                    effect.name = effectItem.name;
                    effect.enabled = effectItem.enabled;
                    if (effectItem.properties) {
                        for (const propertyItem of effectItem.properties) {
                            try {
                                applyPropertyItems(layer, effect, propertyItem);
                            } catch (e) {
                                // pass
                            }
                        }
                    }
                }
            }
        } catch (e) {
            alert(e);
        } finally {
            for (const layer of selectedLayers) {
                layer.selected = true;
            }
            app.endUndoGroup();
        }
    };

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 2;
        win.preferredSize = [300, 300];
    })
        .addGroup(Param.ToolGroup, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.spacing = ui.margins = 0;
            ui.orientation = 'row';
        })
        .addEditText(Param.Search, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            const refresh = Atarabi.app.debounce(() => {
                emitter.notify(Event.Refresh);
            }, 200);
            ui.onChanging = () => {
                emitter.notify(Event.SearchChanging, ui.text ? true : false);
                refresh();
            };
        })
        .addButton(Param.Add, '＋', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'fill'];
            ui.preferredSize = [25, 18];
            ui.onClick = () => {
                const newItem = createPreset();
                if (!newItem) {
                    return;
                }
                emitter.notify(Event.Add, newItem);
            };
        })
        .addButton(Param.Remove, '－', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'fill'];
            ui.preferredSize = [25, 18];
            ui.onClick = () => {
                emitter.notify(Event.Remove);
            };
        })
        .addButton(Param.Up, '↑', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'fill'];
            ui.preferredSize = [25, 18];
            ui.onClick = () => {
                emitter.notify(Event.Up);
            };
            emitter.addEventListener(Event.SearchChanging, (isInput: boolean) => {
                ui.enabled = !isInput;
            });
        })
        .addButton(Param.Down, '↓', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'fill'];
            ui.preferredSize = [25, 18];
            ui.onClick = () => {
                emitter.notify(Event.Down);
            };
            emitter.addEventListener(Event.SearchChanging, (isInput: boolean) => {
                ui.enabled = !isInput;
            });
        })
        .addGroupEnd()
        .addListBox(Param.PresetList, undefined, { numberOfColumns: 2, columnWidths: [150, 200], }, (ui, emitter) => {
            type PresetListBoxItem = ListItem & { item: PresetItem };
            ui.alignment = ['fill', 'fill'];
            ui.onDoubleClick = () => {
                const selection = ui.selection as PresetListBoxItem;
                if (!selection) {
                    return;
                }
                applyPreset(selection.item);
            };

            ui.addEventListener('mousedown', (e: MouseEvent) => {
                const selection = ui.selection as PresetListBoxItem;
                if (!selection) {
                    return;
                }
                if (e.button === 2) {
                    const index = Atarabi.UI.showContextMenu([{ text: 'Rename' }, { text: 'Rewrite Description' }, { text: 'Remove' }]);
                    if (index === 0) {
                        let newName = prompt('Input a preset name', selection.item.name, SCRIPT_NAME);
                        if (newName) {
                            selection.text = selection.item.name = newName;
                            emitter.notify(Event.Save);
                            ui.notify('onDraw');
                        }
                    } else if (index === 1) {
                        let newDescription = prompt('Input a description', selection.item.description, SCRIPT_NAME);
                        if (newDescription != null) {
                            selection.subItems[0].text = selection.item.description = newDescription;
                            emitter.notify(Event.Save);
                            ui.notify('onDraw');
                        }
                    } else if (index === 2) {
                        emitter.notify(Event.Remove);
                    }
                }
            });

            emitter.addEventListener(Event.Add, (newItem: PresetItem) => {
                PRESET.presets.unshift(newItem);
                emitter.notify(Event.Save);
                emitter.notify(Event.Refresh);
            });

            emitter.addEventListener(Event.Remove, () => {
                const selection = ui.selection as PresetListBoxItem;
                if (!selection) {
                    return;
                }
                if (!confirm(`Remove "${selection.text}"?`)) {
                    return;
                }
                const item = selection.item;
                let index = -1;
                for (let i = 0; i < PRESET.presets.length; i++) {
                    const preset = PRESET.presets[i];
                    if (preset === item) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0) {
                    PRESET.presets.splice(index, 1);
                    emitter.notify(Event.Save);
                    emitter.notify(Event.Refresh);
                }
            });

            const swapItem = (n: number, m: number) => {
                const nItem = PRESET.presets[n];
                const mItem = PRESET.presets[m];
                const nListItem = ui.items[n] as PresetListBoxItem;
                const mListItem = ui.items[m] as PresetListBoxItem;
                PRESET.presets[n] = nListItem.item = mItem;
                PRESET.presets[m] = mListItem.item = nItem;
                nListItem.text = mItem.name;
                nListItem.subItems[0].text = mItem.description;
                mListItem.text = nItem.name;
                mListItem.subItems[0].text = nItem.description;
                emitter.notify(Event.Save);
                ui.selection = m;
                ui.notify('onDraw');
            };

            emitter.addEventListener(Event.Up, () => {
                const selection = ui.selection as PresetListBoxItem;
                if (!selection) {
                    return;
                }
                const index = selection.index;
                if (index <= 0) {
                    return;
                }
                swapItem(index, index - 1);
            });

            emitter.addEventListener(Event.Down, () => {
                const selection = ui.selection as PresetListBoxItem;
                if (!selection) {
                    return;
                }
                const index = selection.index;
                if (index + 1 >= PRESET.presets.length) {
                    return;
                }
                swapItem(index, index + 1);
            });

            emitter.addEventListener(Event.Refresh, (searchText?: string) => {
                searchText = typeof searchText === 'string' ? searchText : builder.get(Param.Search);
                const presets = searcher.search(searchText);
                ui.removeAll();
                for (const preset of presets) {
                    try {
                        const item = ui.add('item', preset.name) as PresetListBoxItem;
                        item.subItems[0].text = preset.description;
                        item.item = preset;
                    } catch (e) {
                        app.setTimeout(() => {
                            emitter.notify(Event.Refresh, searchText);
                        }, 500);
                        return;
                    }
                }
            });
        })
        .addEventListener(Event.Save, () => {
            PRESET.updatedAt = new Date().toLocaleString();
            savePreset(PRESET_FILE, PRESET);
        })
        .build();

    builder.onInit(builder => {
        builder.notify(Event.Refresh, '');
    });

})(this);