/**
 * @still_maker v1.0.1
 *
 *      v1.0.1(2024/11/14)  Improve behavior of browse button
 *      v1.0.0(2023/08/28)
 */
(function (global) {
    var SCRIPT_NAME = '@still_maker';
    var DEFAULT_IMAGE_PATH = new File("".concat((Folder.desktop.absoluteURI), "/[name]_##.[ext]")).fsName;
    var Param;
    (function (Param) {
        Param["PathGroup"] = "PathGroup";
        Param["Path"] = "Path";
        Param["BrowsePath"] = "BrowsePath";
        Param["Target"] = "Target";
        Param["OptionsGroup"] = "OptionsGroup";
        Param["Type"] = "Extension";
        Param["Downsample"] = "Downsample";
        Param["Make"] = "Make";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["SaveSetting"] = "SaveSetting";
        Event["UpdateType"] = "UpdateType";
    })(Event || (Event = {}));
    ;
    var Target = {
        Comp: 'Composition',
        Layer: 'A Selected Layer',
    };
    var Type = {
        Png: 'PNG',
        Jpeg: 'JPEG',
        Hdr: 'HDR',
        Clipboard: 'Clipboard',
    };
    var Downsample = {
        Full: 'Full',
        Half: 'Half',
        Third: 'Third',
        Quarter: 'Quarter',
        Fifth: 'Fifth',
        Sixth: 'Sixth',
        Seventh: 'Seventh',
        Eighth: 'Eighth',
    };
    function convertDownsample(downsample) {
        switch (downsample) {
            case Downsample.Full:
                return 1;
            case Downsample.Half:
                return 2;
            case Downsample.Third:
                return 3;
            case Downsample.Quarter:
                return 4;
            case Downsample.Fifth:
                return 5;
            case Downsample.Sixth:
                return 6;
            case Downsample.Seventh:
                return 7;
            case Downsample.Eighth:
                return 8;
        }
        throw 'unreachable';
    }
    function values(obj) {
        var arr = [];
        for (var key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    }
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }
    function zfill(number, size, ch) {
        if (ch === void 0) { ch = '0'; }
        var s = '' + number;
        while (s.length < size) {
            s = ch + s;
        }
        return s;
    }
    function createFolder(folder) {
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
    function replaceFile(file, name, ext) {
        var fsName = file.fsName.replace(/\[name\]/g, name).replace(/\[ext\]/g, ext);
        var m = fsName.match(/#+/);
        if (m) {
            var len = m[0].length;
            var prefix = fsName.substr(0, m.index);
            var suffix = fsName.substr(m.index + len);
            for (var i = 1, mx = Math.pow(10, len); i < mx; i++) {
                var newFsName = prefix + zfill(i, len) + suffix;
                var newFile = new File(newFsName);
                if (!newFile.exists) {
                    return newFile;
                }
            }
        }
        return new File(fsName);
    }
    function isWin() {
        return /^win/i.test($.os);
    }
    function makeFileFilter(exts) {
        if (isWin()) {
            var arr = [];
            for (var _i = 0, exts_1 = exts; _i < exts_1.length; _i++) {
                var ext = exts_1[_i];
                arr.push("*.".concat(ext));
            }
            return arr.join(';');
        }
        return function (f) {
            var re = RegExp('\\.(' + exts.join('|') + ')$', 'i');
            return f instanceof Folder || re.test(f.displayName);
        };
    }
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = win.margins = 1;
    })
        .addGroup(Param.PathGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.preferredSize[0] = 230;
        ui.spacing = ui.margins = 1;
    })
        .addEditText(Param.Path, DEFAULT_IMAGE_PATH, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Still image path';
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
        emitter.addEventListener(Event.UpdateType, function (type) {
            ui.enabled = type !== Type.Clipboard;
        });
    })
        .addButton(Param.BrowsePath, '...', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize = [20, 25];
        ui.helpTip = 'Browse a still image path';
        ui.onClick = function () {
            var path = builder.get(Param.Path);
            var fileFilter = makeFileFilter(['[ext]', 'jpg', 'png', 'hdr']);
            var file = path && isWin() ? new File(path).openDlg('Still image path', fileFilter) : File.openDialog('Still image path', fileFilter);
            if (file) {
                builder.set(Param.Path, file.fsName);
                emitter.notify(Event.SaveSetting);
            }
        };
        emitter.addEventListener(Event.UpdateType, function (type) {
            ui.enabled = type !== Type.Clipboard;
        });
    })
        .addGroupEnd()
        .addDropDownList(Param.Target, values(Target), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Target';
        ui.selection = 0;
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addGroup(Param.OptionsGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addDropDownList(Param.Type, values(Type), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Type';
        ui.selection = 0;
        ui.onChange = function () {
            if (builder) {
                emitter.notify(Event.UpdateType, builder.get(Param.Type));
            }
            emitter.notify(Event.SaveSetting);
        };
    })
        .addDropDownList(Param.Downsample, values(Downsample), undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize[0] = 70;
        ui.helpTip = 'Downsample';
        ui.selection = 0;
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addGroupEnd()
        .addButton(Param.Make, undefined, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.onClick = function () {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                return;
            }
            try {
                var target = builder.get(Param.Target);
                var type = builder.get(Param.Type);
                var downsample = convertDownsample(builder.get(Param.Downsample));
                var path = builder.get(Param.Path);
                if (!path) {
                    return;
                }
                if (path.indexOf('[project]') >= 0) {
                    var projectFile = app.project.file;
                    if (!projectFile) {
                        throw 'Please save this project';
                    }
                    path = path.replace(/\[project\]/g, projectFile.parent.fsName);
                }
                var file = new File(path);
                switch (target) {
                    case Target.Comp: {
                        switch (type) {
                            case Type.Png:
                                file = replaceFile(file, comp.name, 'png');
                                if (file.exists) {
                                    if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                        return;
                                    }
                                }
                                createFolder(file.parent);
                                Atarabi.comp.saveFrameToPng(comp, file, { downsample: downsample });
                                break;
                            case Type.Jpeg:
                                file = replaceFile(file, comp.name, 'jpg');
                                if (file.exists) {
                                    if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                        return;
                                    }
                                }
                                createFolder(file.parent);
                                Atarabi.comp.saveFrameToJpg(comp, file, { downsample: downsample, quality: 100 });
                                break;
                            case Type.Hdr:
                                file = replaceFile(file, comp.name, 'hdr');
                                if (file.exists) {
                                    if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                        return;
                                    }
                                }
                                createFolder(file.parent);
                                Atarabi.comp.saveFrameToHdr(comp, file, { downsample: downsample });
                                break;
                            case Type.Clipboard:
                                Atarabi.comp.saveFrameToClipboard(comp, { downsample: downsample });
                                break;
                        }
                        break;
                    }
                    case Target.Layer: {
                        var layer = comp.selectedLayers[0];
                        if (isAVLayer(layer)) {
                            switch (type) {
                                case Type.Png:
                                    file = replaceFile(file, layer.name, 'png');
                                    if (file.exists) {
                                        if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                            return;
                                        }
                                    }
                                    createFolder(file.parent);
                                    Atarabi.layer.saveFrameToPng(layer, file, { downsample: downsample });
                                    break;
                                case Type.Jpeg:
                                    file = replaceFile(file, layer.name, 'jpg');
                                    if (file.exists) {
                                        if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                            return;
                                        }
                                    }
                                    createFolder(file.parent);
                                    Atarabi.layer.saveFrameToJpg(layer, file, { downsample: downsample, quality: 100 });
                                    break;
                                case Type.Hdr:
                                    file = replaceFile(file, layer.name, 'hdr');
                                    if (file.exists) {
                                        if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                            return;
                                        }
                                    }
                                    createFolder(file.parent);
                                    Atarabi.layer.saveFrameToHdr(layer, file, { downsample: downsample });
                                    break;
                                case Type.Clipboard:
                                    Atarabi.layer.saveFrameToClipboard(layer, { downsample: downsample });
                                    break;
                            }
                        }
                        break;
                    }
                }
            }
            catch (err) {
                alert(err);
            }
        };
    })
        .addEventListener(Event.SaveSetting, function () {
        if (builder) {
            builder.saveToSetting("@script/".concat(SCRIPT_NAME), 'settings');
        }
    })
        .build();
    builder.onInit(function (builder) {
        builder.loadFromSetting("@script/".concat(SCRIPT_NAME), 'settings');
        if (!builder.get(Param.Path)) {
            builder.set(Param.Path, DEFAULT_IMAGE_PATH);
        }
        builder.notify(Event.UpdateType, builder.get(Param.Type));
    });
})(this);
