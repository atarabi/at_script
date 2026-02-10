/**
 * @movie_maker v1.0.1
 *
 *      v1.0.1(2024/11/14)  Improve behavior of browse button
 *      v1.0.0(2023/08/28)
 */
(function (global) {
    var SCRIPT_NAME = '@movie_maker';
    var DEFAULT_IMAGE_PATH = new File("".concat((Folder.desktop.absoluteURI), "/[name]_##.[ext]")).fsName;
    var Param;
    (function (Param) {
        Param["PathGroup"] = "PathGroup";
        Param["Path"] = "Path";
        Param["BrowsePath"] = "BrowsePath";
        Param["Type"] = "Extension";
        Param["TargetGroup"] = "TargetGroup";
        Param["Target"] = "Target";
        Param["Area"] = "Area";
        Param["OptionsGroup"] = "OptionsGroup";
        Param["Downsample"] = "Downsample";
        Param["Skip"] = "Skip";
        Param["Speed"] = "Speed";
        Param["Make"] = "Make";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["SaveSetting"] = "SaveSetting";
    })(Event || (Event = {}));
    var Type = {
        Gif: 'GIF',
        Apng: 'APNG',
    };
    var Target = {
        Comp: 'Composition',
        Layer: 'A Selected Layer',
    };
    var Area = {
        WorkArea: 'Work Area',
        LengthOfComp: 'Length of Comp',
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
    function replaceFile(file, name, ext) {
        var displayName = file.displayName.replace(/\[name\]/g, name).replace(/\[ext\]/g, ext);
        var m = displayName.match(/#+/);
        if (m) {
            var len = m[0].length;
            var prefix = displayName.substr(0, m.index);
            var suffix = displayName.substr(m.index + len);
            for (var i = 1, mx = Math.pow(10, len); i < mx; i++) {
                var newDisplayName = prefix + zfill(i, len) + suffix;
                var newFile = new File("".concat(file.parent.absoluteURI, "/").concat(newDisplayName));
                if (!newFile.exists) {
                    return newFile;
                }
            }
        }
        return new File("".concat(file.parent.absoluteURI, "/").concat(displayName));
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
        ui.helpTip = 'A image path';
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addButton(Param.BrowsePath, '...', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize = [20, 25];
        ui.helpTip = 'Browse a image path';
        ui.onClick = function () {
            var path = builder.get(Param.Path);
            var fileFilter = makeFileFilter(['gif', 'png']);
            var file = path && isWin() ? new File(path).openDlg('A image path', fileFilter) : File.openDialog('A image path', fileFilter);
            if (file) {
                builder.set(Param.Path, file.fsName);
                emitter.notify(Event.SaveSetting);
            }
        };
    })
        .addDropDownList(Param.Type, values(Type), undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize[0] = 60;
        ui.helpTip = 'Type';
        ui.selection = 0;
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addGroupEnd()
        .addGroup(Param.TargetGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addDropDownList(Param.Target, values(Target), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Target';
        ui.selection = 0;
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addDropDownList(Param.Area, values(Area), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Area';
        ui.selection = 0;
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addGroupEnd()
        .addGroup(Param.OptionsGroup, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addDropDownList(Param.Downsample, values(Downsample), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.preferredSize[0] = 70;
        ui.helpTip = 'Downsample';
        ui.selection = 0;
        ui.onChange = function () {
            emitter.notify(Event.SaveSetting);
        };
    })
        .addNumber(Param.Skip, { initialvalue: 0, minvalue: 0, maxvalue: 10 }, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.preferredSize[0] = 50;
        ui.helpTip = 'Skip';
        ui.onChange = function () {
            builder.set(Param.Skip, Math.round(builder.get(Param.Skip)));
            emitter.notify(Event.SaveSetting);
        };
    })
        .addNumber(Param.Speed, { initialvalue: 1, minvalue: 0.01, maxvalue: 5 }, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.preferredSize[0] = 50;
        ui.helpTip = 'Speed';
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
                var area = builder.get(Param.Area);
                var downsample = convertDownsample(builder.get(Param.Downsample));
                var skip = builder.get(Param.Skip);
                var speed = builder.get(Param.Speed);
                var startTime = 0, endTime = 0;
                switch (area) {
                    case Area.WorkArea:
                        startTime = comp.workAreaStart;
                        endTime = comp.workAreaStart + comp.workAreaDuration;
                        break;
                    case Area.LengthOfComp:
                        startTime = 0;
                        endTime = comp.duration;
                        break;
                }
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
                            case Type.Gif:
                                file = replaceFile(file, comp.name, 'gif');
                                if (file.exists) {
                                    if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                        return;
                                    }
                                }
                                Atarabi.comp.saveFramesToGif(comp, startTime, endTime, file, { downsample: downsample, skip: skip, speed: speed });
                                break;
                            case Type.Apng:
                                file = replaceFile(file, comp.name, 'png');
                                if (file.exists) {
                                    if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                        return;
                                    }
                                }
                                Atarabi.comp.saveFramesToApng(comp, startTime, endTime, file, { downsample: downsample, skip: skip, speed: speed });
                                break;
                        }
                        break;
                    }
                    case Target.Layer: {
                        var layer = comp.selectedLayers[0];
                        if (isAVLayer(layer)) {
                            switch (type) {
                                case Type.Gif:
                                    file = replaceFile(file, layer.name, 'gif');
                                    if (file.exists) {
                                        if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                            return;
                                        }
                                    }
                                    Atarabi.layer.saveFramesToGif(layer, startTime, endTime, file, { downsample: downsample, skip: skip, speed: speed });
                                    break;
                                case Type.Apng:
                                    file = replaceFile(file, layer.name, 'png');
                                    if (file.exists) {
                                        if (!confirm("Overwrite \"".concat(file.displayName, "\"?"))) {
                                            return;
                                        }
                                    }
                                    Atarabi.layer.saveFramesToApng(layer, startTime, endTime, file, { downsample: downsample, skip: skip, speed: speed });
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
    });
})(this);
