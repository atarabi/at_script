/**
 * @effects_in_use v1.0.0
 * 
 *      v1.0.0(2023/12/05)
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@effects_in_use';

    enum Param {
        Scan = 'Scan',
        EffectList = 'EffectList',
        InstanceList = 'InstanceList',
    }

    enum Event {
        Scan = 'Scan',
        UpdateInstance = 'UpdateInstance',
    }

    /*
    *   Utility
    */
    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }

    /*
    *   Main
    */
    type EffectItem = { displayName: string; matchName: string; category: string; };
    const EFFECT_MAP: { [matchName: string]: EffectItem } = {};

    for (let { displayName, matchName, category } of app.effects) {
        if (displayName && matchName && category) {
            const item = { displayName, matchName, category };
            EFFECT_MAP[matchName] = item;
        }
    }

    type InstanceItem = { layer: AVLayer; name: string; enabled: boolean; };

    type EffectList = { [matchName: string]: InstanceItem[] };

    let effectList: EffectList = {};

    function updateEffectList() {
        effectList = {};
        Atarabi.UI.progress('Scanning..', app.project.numItems, ctx => {
            const item = app.project.item(ctx.index + 1);
            if (item instanceof CompItem) {
                for (let j = 1; j <= item.numLayers; j++) {
                    const layer = item.layer(j);
                    if (isAVLayer(layer)) {
                        for (let k = 1; k <= layer.effect.numProperties; k++) {
                            const effect = layer.effect(k);
                            if (!effectList[effect.matchName]) {
                                effectList[effect.matchName] = [];
                            }
                            effectList[effect.matchName].push({ layer, name: effect.name, enabled: effect.enabled });
                        }
                    }
                }
            }
        });
        let effectArray: { matchName: string; number: number }[] = [];
        for (let matchName in effectList) {
            effectArray.push({ matchName, number: effectList[matchName].length });
        }
        effectArray.sort((lhs, rhs) => {
            return rhs.number - lhs.number;
        });
        return effectArray;
    }

    function isValidInstanceItem(item: InstanceItem) {
        return isValid(item.layer) && item.layer.effect(item.name) != null;
    }

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 2;
        win.preferredSize = [400, 300];
    })
        .addButton(Param.Scan, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.onClick = () => {
                emitter.notify(Event.Scan);
            };
        })
        .addListBox(Param.EffectList, undefined, { numberOfColumns: 3, showHeaders: true, columnWidths: [150, 150, 50], columnTitles: ['Name', 'Match Name', 'Number'] }, (ui, emitter) => {
            type EffectListBoxItem = ListItem & { item: EffectItem };
            ui.alignment = ['fill', 'fill'];

            emitter.addEventListener(Event.Scan, () => {
                const list = updateEffectList();
                ui.removeAll();
                for (let { matchName, number } of list) {
                    if (EFFECT_MAP[matchName]) {
                        const item = ui.add('item', EFFECT_MAP[matchName].displayName) as EffectListBoxItem;
                        item.subItems[0].text = matchName;
                        item.subItems[1].text = `${number}`;
                        item.item = EFFECT_MAP[matchName];
                    }
                }
                emitter.notify<[EffectItem]>(Event.UpdateInstance, null);
            });

            ui.onChange = () => {
                const selection = ui.selection as EffectListBoxItem;
                if (selection) {
                    emitter.notify<[EffectItem]>(Event.UpdateInstance, selection.item);
                }
            };
        })
        .addListBox(Param.InstanceList, undefined, { numberOfColumns: 3, showHeaders: true, columnWidths: [100, 100, 100], columnTitles: ['Comp', 'Layer', 'Effect'] }, (ui, emitter) => {
            type InstanceListBoxItem = ListItem & { item: InstanceItem };
            ui.alignment = ['fill', 'fill'];

            emitter.addEventListener(Event.UpdateInstance, (effectItem: EffectItem) => {
                ui.removeAll();
                if (!effectItem) {
                    return;
                }
                const list = effectList[effectItem.matchName];
                for (let instance of list) {
                    if (!isValidInstanceItem(instance)) {
                        continue;
                    }
                    const item = ui.add('item', instance.layer.containingComp.name) as InstanceListBoxItem;
                    item.checked = instance.enabled;
                    item.subItems[0].text = instance.layer.name;
                    item.subItems[1].text = instance.name;
                    item.item = instance;
                }
                ui.columns.preferredWidths = [100, 100, 100];
            });

            ui.onDoubleClick = () => {
                const selection = ui.selection as InstanceListBoxItem;
                if (!selection) {
                    return;
                }
                const item = selection.item;
                if (!isValidInstanceItem(item)) {
                    return;
                }
                try {
                    app.beginUndoGroup(`${SCRIPT_NAME}: Focus`);
                    const layer = item.layer;
                    const comp = layer.containingComp;
                    comp.openInViewer();
                    if (!layer.locked) {
                        for (let layer of comp.selectedLayers.slice()) {
                            layer.selected = false;
                        }
                        layer.selected = true;
                        layer.effect(item.name).selected = true;
                    }
                } catch (e) {
                    alert(e);
                } finally {
                    app.endUndoGroup();
                }

            };
        })
        .build();

})(this);