/**
 * @script_panel v1.1.0
 *
 *      v1.1.0(2025/02/01) support jsxbin
 *      v1.0.0(2024/11/14)
 */
(function (global) {
    var SCRIPT_NAME = '@script_panel';
    var Param;
    (function (Param) {
        Param["ListGroup"] = "List Group";
        Param["List"] = "List";
        Param["Refresh"] = "Refresh";
        Param["Open"] = "Open";
        Param["Panel"] = "Panel";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Refresh"] = "Refresh";
        Event["Update"] = "Update";
    })(Event || (Event = {}));
    var SCRIPT_UI_FOLDER = new Folder("".concat(Folder.userData.absoluteURI, "/Atarabi/@scripts/").concat(SCRIPT_NAME));
    function createFolder(folder) {
        if (folder.exists) {
            return;
        }
        var parents = [];
        var parent = folder;
        while (!(parent && parent.exists)) {
            parents.push(parent);
            parent = parent.parent;
        }
        parents.reverse();
        for (var _i = 0, parents_1 = parents; _i < parents_1.length; _i++) {
            var folder_1 = parents_1[_i];
            folder_1.create();
        }
    }
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = win.margins = 1;
    })
        .addGroup(Param.ListGroup, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.preferredSize[0] = 200;
        ui.spacing = ui.margins = 1;
    })
        .addDropDownList(Param.List, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        emitter.addEventListener(Event.Refresh, function () {
            ui.removeAll();
            ui.add('item', '--- not selected ---');
            var files = [];
            for (var _i = 0, _a = SCRIPT_UI_FOLDER.getFiles(); _i < _a.length; _i++) {
                var file = _a[_i];
                if (file instanceof File) {
                    if (/\.jsx(bin)?$/i.test(file.displayName)) {
                        files.push(file);
                    }
                }
            }
            files.sort(function (lhs, rhs) {
                if (lhs.displayName < rhs.displayName) {
                    return -1;
                }
                else if (lhs.displayName > rhs.displayName) {
                    return 1;
                }
                return 0;
            });
            for (var _b = 0, files_1 = files; _b < files_1.length; _b++) {
                var file = files_1[_b];
                var item = ui.add('item', file.displayName);
                item.file = file;
            }
            ui.selection = 0;
        });
        ui.onChange = function () {
            var selection = ui.selection;
            if (!selection) {
                return;
            }
            if (!(selection.file && selection.file.exists)) {
                return;
            }
            emitter.notify(Event.Update, selection.file);
        };
    })
        .addButton(Param.Refresh, 'R', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize[0] = 30;
        ui.helpTip = "Refresh";
        ui.onClick = function () {
            emitter.notify(Event.Refresh);
        };
    })
        .addButton(Param.Open, 'O', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize[0] = 30;
        ui.helpTip = "Open ScriptUI folder";
        ui.onClick = function () {
            if (!SCRIPT_UI_FOLDER.exists) {
                createFolder(SCRIPT_UI_FOLDER);
            }
            SCRIPT_UI_FOLDER.execute();
        };
    })
        .addGroupEnd()
        .addGroup(Param.Panel, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'fill'];
        ui.alignChildren = ['fill', 'fill'];
        ui.preferredSize[1] = 200;
        ui.orientation = 'stack';
        var panelMap = {};
        var panels = [];
        emitter.addEventListener(Event.Update, function (file) {
            if (panelMap[file.absoluteURI] == null) {
                var panel = ui.add('panel');
                panel.alignment = ['fill', 'fill'];
                panelMap[file.absoluteURI] = panel;
                panels.push(panel);
                (function () {
                    $.evalFile(file.fsName);
                }).call(panel);
            }
            for (var _i = 0, panels_1 = panels; _i < panels_1.length; _i++) {
                var panel = panels_1[_i];
                panel.visible = false;
            }
            panelMap[file.absoluteURI].visible = true;
            ui.layout.layout(true);
            ui.layout.resize();
        });
    })
        .build();
    builder.onInit(function (builder) {
        builder.notify(Event.Refresh);
    });
})(this);
