/**
 * @script_panel v1.1.0
 * 
 *      v1.1.0(2025/02/01) support jsxbin
 *      v1.0.0(2024/11/14)
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@script_panel';

    enum Param {
        ListGroup = 'List Group',
        List = 'List',
        Refresh = 'Refresh',
        Open = 'Open',
        Panel = 'Panel',
    }

    enum Event {
        Refresh = 'Refresh',
        Update = 'Update',
    }

    const SCRIPT_UI_FOLDER = new Folder(`${Folder.userData.absoluteURI}/Atarabi/@scripts/${SCRIPT_NAME}`);

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

    type ScriptItem = ListItem & { file: File; };

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 1;
    })
        .addGroup(Param.ListGroup, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.preferredSize[0] = 200;
            ui.spacing = ui.margins = 1;
        })
        .addDropDownList(Param.List, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            emitter.addEventListener(Event.Refresh, () => {
                ui.removeAll();
                ui.add('item', '--- not selected ---');
                const files: File[] = [];
                for (const file of SCRIPT_UI_FOLDER.getFiles()) {
                    if (file instanceof File) {
                        if (/\.jsx(bin)?$/i.test(file.displayName)) {
                            files.push(file);
                        }
                    }
                }
                files.sort((lhs, rhs) => {
                    if (lhs.displayName < rhs.displayName) {
                        return -1;
                    } else if (lhs.displayName > rhs.displayName) {
                        return 1;
                    }
                    return 0;
                })
                for (const file of files) {
                    const item = ui.add('item', file.displayName) as ScriptItem;
                    item.file = file;
                }
                ui.selection = 0;
            });
            ui.onChange = () => {
                const selection = ui.selection as ScriptItem;
                if (!selection) {
                    return;
                }
                if (!(selection.file && selection.file.exists)) {
                    return;
                }
                emitter.notify(Event.Update, selection.file);
            };
        })
        .addButton(Param.Refresh, 'R', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize[0] = 30;
            ui.helpTip = `Refresh`;
            ui.onClick = () => {
                emitter.notify(Event.Refresh);
            };
        })
        .addButton(Param.Open, 'O', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize[0] = 30;
            ui.helpTip = `Open ScriptUI folder`;
            ui.onClick = () => {
                if (!SCRIPT_UI_FOLDER.exists) {
                    createFolder(SCRIPT_UI_FOLDER);
                }
                SCRIPT_UI_FOLDER.execute();
            };
        })
        .addGroupEnd()
        .addGroup(Param.Panel, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'fill'];
            ui.alignChildren = ['fill', 'fill'];
            ui.preferredSize[1] = 200;
            ui.orientation = 'stack';

            const panelMap: { [path: string]: Panel; } = {};
            const panels: Panel[] = [];

            emitter.addEventListener(Event.Update, (file: File) => {
                if (panelMap[file.absoluteURI] == null) {
                    const panel = ui.add('panel');
                    panel.alignment = ['fill', 'fill'];
                    panelMap[file.absoluteURI] = panel;
                    panels.push(panel);
                    (() => {
                        $.evalFile(file.fsName);
                    }).call(panel);
                }

                for (const panel of panels) {
                    panel.visible = false;
                }

                panelMap[file.absoluteURI].visible = true;
                ui.layout.layout(true);
                ui.layout.resize();
            });
        })
        .build()
        ;

    builder.onInit(builder => {
        builder.notify(Event.Refresh);
    });

})(this);