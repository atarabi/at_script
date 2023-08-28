/**
 * @paramdefs_viewer v1.0.0
 */
((global: Global | Panel) => {

    const SCRIPT_NAME = '@paramdefs_viewer';

    enum Param {
        Text = 'Text',
    }

    enum Event {
        Refresh = 'Refresh',
    }

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

    const isValidProperty = (paramDef: Atarabi.ParamDef) => {
        switch (paramDef.type) {
            case 'Button':
            case 'Group Start':
            case 'Group End':
            case 'No Data':
            case 'Path':
                return false;
        }
        return true;
    };

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, (win, emitter) => {
        win.spacing = win.margins = 1;
        win.preferredSize = [400, 300];
        win.addEventListener('mouseover', () => {
            emitter.notify(Event.Refresh);
        });
    })
        .addEditText(Param.Text, '', { multiline: true }, (ui, emitter) => {
            ui.alignment = ['fill', 'fill'];
            let effect: PropertyGroup = null;
            emitter.addEventListener(Event.Refresh, () => {
                const activeEffect = getActiveEffect();
                if (activeEffect === null || activeEffect == effect) {
                    return;
                }
                effect = activeEffect;
                type ParamDef = { name: string; matchName: string; index: number; paramDef: Atarabi.ParamDef; expression?: string; value?: Atarabi.ValueType, hidden?: boolean; };
                const paramDefs: ParamDef[] = [];
                for (let i = 1, len = effect.numProperties; i <= len; i++) {
                    const property = effect(i);
                    if (property instanceof Property) {
                        const paramDef: ParamDef = {
                            name: property.name,
                            matchName: property.matchName,
                            index: i,
                            paramDef: Atarabi.property.getParamDef(property),
                        };
                        const expression = Atarabi.property.getExpression(property);
                        if (expression) {
                            paramDef.expression = expression;
                        }
                        if (isValidProperty(paramDef.paramDef)) {
                            paramDef.value = Atarabi.property.getValue(property);
                        }
                        const hidden = Atarabi.property.isHidden(property);
                        if (hidden) {
                            paramDef.hidden = hidden;
                        }
                        paramDefs.push(paramDef);
                    }
                }
                ui.text = Atarabi.JSON.stringify(paramDefs, undefined, 2);
            });
        })
        .build()
        ;

})(this);