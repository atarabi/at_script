/**
 * @proxy_maker v1.0.0
 *
 *      v1.0.0(2024/10/22)
 */
(function (global) {
    var SCRIPT_NAME = '@proxy_maker';
    var SIG = '@proxy';
    var Param;
    (function (Param) {
        Param["Info"] = "Info";
        Param["Make"] = "Make";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Refresh"] = "Refresh";
    })(Event || (Event = {}));
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win, emitter) {
        win.spacing = win.margins = 3;
        win.addEventListener('mouseover', function () {
            emitter.notify(Event.Refresh);
        });
    })
        .addStaticText(Param.Info, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.preferredSize[0] = 300;
        emitter.addEventListener(Event.Refresh, function () {
            var layer = getActiveAVLayer();
            if (!layer) {
                builder.set(Param.Info, '');
                return;
            }
            builder.set(Param.Info, "".concat(layer.index, ": ").concat(layer.name));
        });
    })
        .addButton(Param.Make, undefined, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.onClick = function () {
            var layer = getActiveAVLayer();
            if (!layer) {
                return;
            }
            var comp = layer.containingComp;
            var projectFile = app.project.file;
            if (!projectFile) {
                return;
            }
            var projectFolder = projectFile.parent;
            var prefix = "".concat(comp.id, "_").concat(Atarabi.layer.getID(layer));
            var proxyFolder = new Folder("".concat(projectFolder.absoluteURI, "/").concat(SIG, "/").concat(prefix));
            createFolder(proxyFolder);
            var createFile = function (frame) { return new File("".concat(proxyFolder.absoluteURI, "/").concat(prefix, "_").concat(zfill(frame, 5), ".png")); };
            try {
                app.beginUndoGroup(SCRIPT_NAME);
                var workAreaStart = comp.workAreaStart, workAreaDuration = comp.workAreaDuration, frameDuration_1 = comp.frameDuration;
                var secondToFrame = function (time) { return Math.round(time / frameDuration_1); };
                var _a = [secondToFrame(workAreaStart), secondToFrame(workAreaStart + workAreaDuration)], workFrom_1 = _a[0], workTo_1 = _a[1];
                var inPoint = layer.inPoint, outPoint = layer.outPoint;
                var _b = [secondToFrame(inPoint), secondToFrame(outPoint)], from_1 = _b[0], to = _b[1];
                Atarabi.UI.progress('making..', to - from_1, function (ctx) {
                    var frame = ctx.index + from_1;
                    var file = createFile(frame);
                    if (file.exists && (frame < workFrom_1 || frame >= workTo_1)) {
                        return;
                    }
                    Atarabi.layer.saveFrameToPng(layer, file, { time: frame * frameDuration_1, downsample: 1 });
                });
                var proxyItem = importSequence(createFile(from_1), comp.frameRate);
                var prevLayer = layer.index > 1 ? comp.layer(layer.index - 1) : null;
                if (!(isAVLayer(prevLayer) && prevLayer.source === proxyItem)) {
                    layer.enabled = false;
                    var proxyLayer = comp.layers.add(proxyItem);
                    proxyLayer.startTime = inPoint;
                    proxyLayer.moveBefore(layer);
                }
            }
            catch (err) {
                alert(err);
            }
            finally {
                app.endUndoGroup();
            }
        };
    })
        .build();
    function isAVLayer(layer) {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }
    function getActiveAVLayer() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        var layer = comp.selectedLayers[0];
        if (!isAVLayer(layer)) {
            return null;
        }
        return layer;
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
    function zfill(number, size, ch) {
        if (ch === void 0) { ch = '0'; }
        var s = '' + number;
        while (s.length < size) {
            s = ch + s;
        }
        return s;
    }
    function findFolderItem(name) {
        for (var i = 1, total = app.project.numItems; i <= total; i++) {
            var item = app.project.item(i);
            if (item instanceof FolderItem && item.name === name) {
                return item;
            }
        }
        return app.project.items.addFolder(name);
    }
    function importSequence(file, frameRate) {
        var folder = file.parent.absoluteURI;
        for (var i = 1, total = app.project.numItems; i <= total; i++) {
            var item = app.project.item(i);
            if (!(item instanceof FootageItem)) {
                continue;
            }
            var itemFile = item.file;
            if (itemFile && folder === itemFile.parent.absoluteURI) {
                item.replaceWithSequence(file, false);
                item.mainSource.reload();
                return item;
            }
        }
        var options = new ImportOptions(file);
        options.forceAlphabetical = false;
        options.sequence = true;
        var sequenceItem = app.project.importFile(options);
        sequenceItem.mainSource.conformFrameRate = frameRate;
        sequenceItem.parentFolder = findFolderItem(SIG);
        return sequenceItem;
    }
})(this);
