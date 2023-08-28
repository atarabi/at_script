/**
 * @dropdownlist_viewer v1.0.0
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@dropdownlist_viewer';

    enum Param {
        Container = 'Container',
        Params = 'Params',
        ListGroup = 'List Group',
        List = 'List',
        OptionGroup = 'Option Group',
        RealTime = 'Real Time',
    }

    enum Event {
        Refresh = 'Refresh',
        ChangeParam = 'Change Param',
    }

    type Arg = {
        [Event.ChangeParam]: [Property, Atarabi.PopupDef?];
    };

    const getActiveEffect = (): PropertyGroup | null => {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        const properties = comp.selectedProperties.slice();
        for (const property of properties) {
            if (property.isEffect) {
                return property as PropertyGroup;
            }
        }
        return null;
    };

    const getTimeFromProperty = (property:Property): number => {
        let parent: PropertyGroup = property.parentProperty;
        while (parent.parentProperty) {
            parent = parent.parentProperty;
        }
        return (parent as any as Layer).time;
    };

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, (win, emitter) => {
        win.spacing = win.margins = 1;
        win.preferredSize = [400, 300];
        win.addEventListener('mouseover', () => {
            emitter.notify(Event.Refresh);
        });
    })
        .addGroup(Param.Container, undefined, ui => {
            ui.alignment = ['fill', 'fill'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addListBox(Param.Params, undefined, undefined, (ui, emitter) => {
            type ListItemEx = ListItem & { ex: { property: Property; paramDef: Atarabi.PopupDef; } };
            ui.alignment = ['fill', 'fill'];
            let effect: PropertyGroup = null;
            emitter.addEventListener(Event.Refresh, () => {
                const activeEffect = getActiveEffect();
                if (activeEffect === null || activeEffect == effect) {
                    return;
                }
                effect = activeEffect;
                ui.removeAll();
                for (let i = 1, len = effect.numProperties; i <= len; i++) {
                    const property = effect(i) as Property;
                    if (property.propertyValueType !== PropertyValueType.OneD) {
                        continue;
                    }
                    const paramDef = Atarabi.property.getParamDef(property);
                    if (paramDef.type === 'Popup') {
                        const item = ui.add('item', property.name) as ListItemEx;
                        item.ex = { property, paramDef };
                    }
                }
                emitter.notify<Arg[Event.ChangeParam]>(Event.ChangeParam, null);
            });
            ui.onChange = () => {
                const selection = ui.selection as ListItemEx;
                if (!selection) {
                    return;
                }
                emitter.notify<Arg[Event.ChangeParam]>(Event.ChangeParam, selection.ex.property, selection.ex.paramDef);
            };
        })
        .addGroup(Param.ListGroup, undefined, ui => {
            ui.alignment = ['fill', 'fill'];
            ui.orientation = 'column';
            ui.spacing = ui.margins = 1;
        })
        .addListBox(Param.List, undefined, undefined, (ui, emitter) => {
            type ListItemEx = ListItem & { ex: { index: number; }; };
            let property: Property = null;
            ui.alignment = ['fill', 'fill'];
            emitter.addEventListener<Arg[Event.ChangeParam]>(Event.ChangeParam, (newProperty, paramDef?) => {
                ui.removeAll();
                property = newProperty;
                if (property === null) {
                    return;
                }
                const texts = paramDef.menu.split('|');
                for (let i = 0, len = texts.length; i < len; i++) {
                    const text = texts[i];
                    if (text === '(-') {
                        continue;
                    }
                    const item = ui.add('item', text) as ListItemEx;
                    item.ex = { index: i + 1 };
                }
            });

            const apply = () => {
                const selection = ui.selection as ListItemEx;
                if (!selection) {
                    return;
                }
                if (!isValid(property)) {
                    alert('invalid: please refresh');
                    return;
                }
                if (property.numKeys > 0) {
                    property.setValueAtTime(getTimeFromProperty(property), selection.ex.index);
                } else {
                    property.setValue(selection.ex.index);
                }
            };

            ui.onDoubleClick = apply;

            ui.addEventListener('keydown', (ev: KeyboardEvent) => {
                if (ev.keyName === 'Enter') {
                    ev.preventDefault();
                    apply();
                }
            });

            ui.onChange = () => {
                const realTime = builder.get(Param.RealTime);
                if (realTime) {
                    apply();
                }
            };
        })
        .addGroup(Param.OptionGroup, undefined, ui => {
            ui.alignment = ['fill', 'bottom'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addCheckbox(Param.RealTime, false, 'Real Time', undefined, ui => {
            ui.alignment = ['right', 'bottom'];
        })
        .addGroupEnd()
        .addGroupEnd()
        .addGroupEnd()
        .build()
        ;

})(this);