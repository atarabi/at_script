/**
 * @rpp_loader v1.1.0
 *
 *      v1.1.0(2024/10/22)  Add undo group
 *      v1.0.1(2023/10/08)  Fix empty source
 *      v1.0.0(2023/08/28)
 */
(function (global) {
    var SCRIPT_NAME = '@rpp_loader';
    var Param;
    (function (Param) {
        Param["LoadPanel"] = "LoadPanel";
        Param["PathGroup"] = "Path Group";
        Param["Path"] = "Path";
        Param["BrowsePath"] = "BrowsePath";
        Param["Load"] = "Load";
        Param["Info"] = "Info";
        Param["ExecutePanel"] = "ExecutePanel";
        Param["Target"] = "Target";
        Param["SortGroup"] = "Sort Group";
        Param["OrderBy"] = "OrderBy";
        Param["OrderType"] = "OorderType";
        Param["OptionsGroup"] = "OptionsGroup";
        Param["AddMuteTracks"] = "AddMuteTracks";
        Param["Execute"] = "Execute";
    })(Param || (Param = {}));
    var Event;
    (function (Event) {
        Event["Load"] = "Load";
    })(Event || (Event = {}));
    var Target = {
        Auto: 'Auto',
        NewComp: 'New Comp',
        ActiveComp: 'Active Comp',
    };
    var OrderBy = {
        Track: 'Track',
        Time: 'Time',
    };
    var OorderType = {
        ASC: 'Ascending',
        DESC: 'Descending',
    };
    // Utility
    function filter(values, fn) {
        var arr = [];
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }
    function map(array, fn, thisArg) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            result.push(fn(array[i], i, array));
        }
        return result;
    }
    function some(array, fn) {
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var value = array_1[_i];
            if (fn(value)) {
                return true;
            }
        }
        return false;
    }
    function reduce(arr, fn, initialValue) {
        var l = arr.length;
        if (!l) {
            return initialValue;
        }
        var i = 0;
        var value = initialValue;
        while (i < l) {
            value = fn(value, arr[i], i, arr);
            ++i;
        }
        return value;
    }
    function isArray(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
    ;
    function values(obj) {
        var arr = [];
        for (var key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    }
    function clamp(v, mn, mx) {
        return Math.max(mn, Math.min(mx, v));
    }
    function getCompItem(cond) {
        var project = app.project;
        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            if (item instanceof CompItem && cond(item)) {
                return item;
            }
        }
        return null;
    }
    function getFootageItem(cond) {
        var project = app.project;
        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            if (item instanceof FootageItem && cond(item)) {
                return item;
            }
        }
        return null;
    }
    function getActiveComp() {
        var comp = app.project.activeItem;
        if (comp instanceof CompItem) {
            return comp;
        }
        return null;
    }
    function getFileByPath(path, baseUri) {
        var file = new File(path);
        if (!file.exists) {
            var relativeFile = new File(baseUri);
            relativeFile.changePath(path);
            if (relativeFile.exists) {
                file = relativeFile;
            }
        }
        return file;
    }
    // RPP
    var RPP_HEADER = '<REAPER_PROJECT';
    var RPPType;
    (function (RPPType) {
        RPPType[RPPType["NONE"] = -1] = "NONE";
        RPPType[RPPType["SECTION_START"] = 0] = "SECTION_START";
        RPPType[RPPType["PROPERTY"] = 1] = "PROPERTY";
        RPPType[RPPType["DATA"] = 2] = "DATA";
        RPPType[RPPType["SECTION_END"] = 3] = "SECTION_END";
    })(RPPType || (RPPType = {}));
    var RPPParser = function (line) {
        line = line.replace(/^\s+|\s+$/g, '');
        if (!line.length) {
            return { type: RPPType.NONE };
        }
        var type = RPPType.NONE;
        var name = '';
        var values = null;
        var head = line[0];
        var pos = 0;
        var end = line.length;
        if (head === '<') {
            type = RPPType.SECTION_START;
            ++pos;
        }
        else if (head === '>') {
            type = RPPType.SECTION_END;
        }
        else {
            type = RPPType.PROPERTY;
        }
        if (type === RPPType.SECTION_START || type === RPPType.PROPERTY) {
            name = '';
            while (pos < end && line[pos] !== ' ') {
                name += line[pos];
                ++pos;
            }
            values = [];
            while (pos < end) {
                if (line[pos] === ' ') {
                    ++pos;
                    continue;
                }
                var sep = (function (head) {
                    switch (head) {
                        case '`':
                            ++pos;
                            return '`';
                        case "'":
                            ++pos;
                            return "'";
                        case '"':
                            ++pos;
                            return '"';
                        default:
                            return ' ';
                    }
                })(line[pos]);
                var value = '';
                while (pos < end) {
                    if (line[pos] === sep) {
                        ++pos;
                        break;
                    }
                    value += line[pos];
                    ++pos;
                }
                values.push(value);
            }
        }
        if (type === RPPType.PROPERTY && !values.length) {
            type = RPPType.DATA;
        }
        return { type: type, name: name, values: values };
    };
    var RPPSection = /** @class */ (function () {
        function RPPSection(name, values) {
            this.name = '';
            this.values = [];
            this.properties = {};
            this.data = '';
            this.children = {};
            this.name = name;
            this.values = values;
        }
        RPPSection.prototype.load = function (lines, row) {
            for (var total = lines.length; row < total; ++row) {
                var _a = RPPParser(lines[row]), type = _a.type, name = _a.name, values_2 = _a.values;
                if (type === RPPType.SECTION_START) {
                    var section = new RPPSection(name, values_2);
                    if (!this.children[name]) {
                        this.children[name] = [];
                    }
                    this.children[name].push(section);
                    row = section.load(lines, row + 1);
                }
                else if (type === RPPType.PROPERTY) {
                    if (!this.properties[name]) {
                        this.properties[name] = [];
                    }
                    this.properties[name].push(values_2);
                }
                else if (type === RPPType.DATA) {
                    this.data += name;
                }
                else if (type === RPPType.SECTION_END) {
                    break;
                }
            }
            return row;
        };
        return RPPSection;
    }());
    var RPPItem = /** @class */ (function () {
        function RPPItem(section, trackMute) {
            this.position = +section.properties['POSITION'][0][0];
            this.length = +section.properties['LENGTH'][0][0];
            this.mute = +section.properties['MUTE'][0][0] === 1;
            this.trackMute = trackMute;
            this.iguid = section.properties['IGUID'][0][0];
            this.name = section.properties['NAME'] ? section.properties['NAME'][0][0] : '';
            this.soffs = section.properties['SOFFS'] ? +section.properties['SOFFS'][0][0] : 0;
            this.playrate = section.properties['PLAYRATE'] ? +section.properties['PLAYRATE'][0][0] : 1;
            if (section.children['SOURCE']) {
                var source = section.children['SOURCE'][0];
                switch (source.values[0]) {
                    case 'EMPTY':
                        this.sourceType = 'EMPTY';
                        break;
                    case 'MIDI':
                        this.sourceType = 'MIDI';
                        break;
                    case 'SECTION':
                        source = source.children['SOURCE'][0];
                    default:
                        this.sourceType = source.values[0];
                        this.file = source.properties['FILE'][0][0];
                        break;
                }
                this.sm = [];
                var sms = section.properties['SM'] ? section.properties['SM'][0] : [];
                var sm = [];
                for (var _i = 0, sms_1 = sms; _i < sms_1.length; _i++) {
                    var v = sms_1[_i];
                    if (v === '+') {
                        if (sm.length === 2) {
                            this.sm.push({ x: sm[0], y: sm[1] });
                        }
                        else if (sm.length === 3) {
                            this.sm.push({ x: sm[0], y: sm[1], z: sm[2] });
                        }
                        else {
                            // TODO: error
                        }
                        sm.splice(0);
                    }
                    else {
                        var n = parseFloat(v);
                        if (!isNaN(n)) {
                            sm.push(n);
                        }
                    }
                }
            }
            else {
                this.sourceType = 'EMPTY';
            }
        }
        RPPItem.prototype.getSourceType = function () {
            return this.sourceType;
        };
        RPPItem.prototype.isMute = function () {
            return this.mute || this.trackMute;
        };
        RPPItem.prototype.getIGUID = function () {
            return this.iguid;
        };
        RPPItem.prototype.getInPoint = function () {
            return this.position;
        };
        RPPItem.prototype.getOutPoint = function () {
            return this.position + this.length;
        };
        RPPItem.prototype.getEstimatedDuration = function () {
            return (this.length + this.soffs) * this.playrate;
        };
        RPPItem.prototype.getFilePath = function () {
            return this.file;
        };
        RPPItem.prototype.arrange = function (layer, _a) {
            var orderType = _a.orderType;
            layer.enabled = layer.audioEnabled = !this.isMute();
            if (orderType === OorderType.ASC) {
                layer.moveToEnd();
            }
            else {
                layer.moveToBeginning();
            }
            if (this.name) {
                layer.name = this.name;
            }
            layer.comment = this.iguid;
            layer.inPoint = this.soffs;
            layer.stretch = 100 / this.playrate;
            layer.startTime += this.position - layer.inPoint;
            layer.outPoint = layer.inPoint + this.length;
            if (this.sm.length) {
                layer.timeRemapEnabled = true;
                var timeRemap = layer.property('ADBE Time Remapping');
                var minTime = timeRemap.keyValue(1);
                var maxTime = timeRemap.keyValue(2);
                var inPoint = layer.inPoint;
                var outPoint = layer.outPoint;
                var timeAtOutPoint = timeRemap.valueAtTime(outPoint, true) - timeRemap.valueAtTime(inPoint, true);
                var convert = (function () {
                    var comp = layer.containingComp;
                    var frameDuration = comp.frameDuration;
                    return function (time) {
                        var frames = Math.round(time / frameDuration);
                        return frames * frameDuration;
                    };
                })();
                for (var _i = 0, _b = this.sm; _i < _b.length; _i++) {
                    var _c = _b[_i], x = _c.x, y = _c.y;
                    x = (outPoint - inPoint) / timeAtOutPoint * x + inPoint;
                    timeRemap.setValueAtTime(convert(x), clamp(y, minTime, maxTime));
                }
            }
        };
        return RPPItem;
    }());
    var CompAnalyzer = /** @class */ (function () {
        function CompAnalyzer(comp) {
            this.iguids = {};
            this.masterLayer = null;
            this.tempoLayer = null;
            //comp
            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);
                var comment = layer.comment;
                var m = CompAnalyzer.GUID_REGEX.exec(comment);
                if (m) {
                    var iguid = m[1];
                    this.iguids[iguid] = layer;
                }
                else if (comment.indexOf(RPPLoader.MASTER_TRACK_COMMENT) >= 0) {
                    this.masterLayer = layer;
                }
                else if (comment.indexOf(RPPLoader.TEMPO_TRACK_COMMENT) >= 0) {
                    this.tempoLayer = layer;
                }
            }
        }
        CompAnalyzer.prototype.containsIGUID = function (iguid) {
            return !!this.iguids[iguid];
        };
        CompAnalyzer.prototype.containsMasterLayer = function () {
            return !!this.masterLayer;
        };
        CompAnalyzer.prototype.getMasterLayer = function () {
            return this.masterLayer;
        };
        CompAnalyzer.prototype.containsTempoLayer = function () {
            return !!this.tempoLayer;
        };
        CompAnalyzer.prototype.getTempoLayer = function () {
            return this.tempoLayer;
        };
        CompAnalyzer.GUID_REGEX = /(\{[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\})/i;
        return CompAnalyzer;
    }());
    var RPPLoader = /** @class */ (function () {
        function RPPLoader() {
            this.file = null;
            this.size = [1280, 720, 0];
            this.framerate = 30;
            this.renderFile = '';
            this.items = [];
            this.tempo = [];
            this.tempos = [];
            this.markers = [];
        }
        RPPLoader.loadContents = function (file) {
            if (!file.exists) {
                return '';
            }
            var contents = '';
            file.encoding = 'UTF-8';
            if (file.open('r')) {
                var header = file.read(RPP_HEADER.length);
                if (header === RPP_HEADER) {
                    contents = header + file.read();
                }
                file.close();
            }
            return contents;
        };
        RPPLoader.prototype.clear = function () {
            this.file = null;
            this.size = [1280, 720, 0];
            this.framerate = 30;
            this.renderFile = '';
            this.items = [];
            this.tempo = [];
            this.markers = [];
        };
        RPPLoader.prototype.load = function (file, contents) {
            this.clear();
            this.file = file;
            //build tree
            var lines = contents.split(/\n/);
            var rootResult = RPPParser(lines[0]);
            var root = new RPPSection(rootResult.name, rootResult.values);
            root.load(lines, 1);
            //items
            var mutes = [false];
            var prevIsbus = [0, 0];
            var tracks = root.children['TRACK'];
            if (isArray(tracks)) {
                for (var _i = 0, tracks_1 = tracks; _i < tracks_1.length; _i++) {
                    var track = tracks_1[_i];
                    var mute = track.properties['MUTESOLO'][0][0] === '1';
                    var isbus = map(track.properties['ISBUS'][0], function (val) { return +val; });
                    var cmd = prevIsbus[0], delta = prevIsbus[1];
                    switch (cmd) {
                        case 0:
                            mutes[mutes.length - 1] = mute;
                            break;
                        case 1:
                            mutes.push(mute);
                            break;
                        case 2:
                            mutes = mutes.slice(0, mutes.length + delta);
                            mutes[mutes.length - 1] = mute;
                            break;
                    }
                    prevIsbus = isbus;
                    var trackMute = some(mutes, function (mute) { return mute; });
                    var items = track.children['ITEM'] || [];
                    for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
                        var item = items_1[_a];
                        var rppItem = new RPPItem(item, trackMute);
                        this.items.push(rppItem);
                    }
                }
            }
            //size
            if (root.properties['VIDEO_CONFIG']) {
                this.size = map(root.properties['VIDEO_CONFIG'][0], function (val) { return +val; });
            }
            //framerate
            if (root.properties['SMPTESYNC']) {
                this.framerate = +root.properties['SMPTESYNC'][0][1];
            }
            //render file
            if (root.properties['RENDER_FILE'] && root.properties['RENDER_FILE'][0][0]) {
                this.renderFile = root.properties['RENDER_FILE'][0][0];
            }
            else if (root.properties['RENDER_PATTERN'] && root.properties['RENDER_PATTERN'][0][0]) {
                var pattern = root.properties['RENDER_PATTERN'][0][0];
                var files = this.file.parent.getFiles("".concat(pattern, ".*"));
                for (var _b = 0, files_1 = files; _b < files_1.length; _b++) {
                    var file_1 = files_1[_b];
                    if (/\.(wav|mp3|flac)$/i.test(file_1.displayName)) {
                        this.renderFile = file_1.absoluteURI;
                        break;
                    }
                }
            }
            //tempo
            if (root.properties['TEMPO']) {
                this.tempo = map(root.properties['TEMPO'][0], function (val) { return +val; });
            }
            //tempos
            if (root.children['TEMPOENVEX']) {
                var PTs = root.children['TEMPOENVEX'][0].properties['PT'];
                if (isArray(PTs)) {
                    for (var _c = 0, PTs_1 = PTs; _c < PTs_1.length; _c++) {
                        var PT = PTs_1[_c];
                        var time = parseFloat(PT[0]);
                        var bpm = parseFloat(PT[1]);
                        var shape = parseInt(PT[2], 10);
                        if (PT[3] && parseInt(PT[3], 10) > 0) {
                            var signature = parseInt(PT[3], 10);
                            this.tempos.push({ time: time, bpm: bpm, shape: shape, signature: { num: (signature) & 0xFFFF, den: (signature >> 16) & 0xFFFF } });
                        }
                        else {
                            this.tempos.push({ time: time, bpm: bpm, shape: shape });
                        }
                    }
                }
            }
            //markers
            if (root.properties['MARKER']) {
                this.markers = map(root.properties['MARKER'], function (values) {
                    return { time: +values[1], text: values[2] };
                });
            }
            return {
                itemNum: this.items.length,
                activeItemNum: reduce(this.items, function (total, item) {
                    if (!item.isMute()) {
                        return total + 1;
                    }
                    return total;
                }, 0),
                framerate: this.framerate,
                size: this.size,
            };
        };
        RPPLoader.prototype.valid = function () {
            return this.file !== null;
        };
        RPPLoader.prototype.execute = function (_a, isChild) {
            var _this = this;
            var target = _a.target, sort = _a.sort, addMuteTracks = _a.addMuteTracks;
            if (isChild === void 0) { isChild = false; }
            var comp = null;
            if (target === Target.Auto) {
                comp = getCompItem(function (item) { return item.comment === _this.file.absoluteURI; });
                if (!comp) {
                    comp = this.createComp(isChild ? true : addMuteTracks);
                }
            }
            else if (target === Target.NewComp) {
                comp = this.createComp(addMuteTracks);
            }
            else if (target === Target.ActiveComp) {
                comp = getActiveComp();
            }
            else {
                return null;
            }
            var analyzer = new CompAnalyzer(comp);
            this.createLayers(comp, analyzer, { sort: sort, addMuteTracks: addMuteTracks });
            this.createTempo(comp, analyzer);
            this.createMarkers(comp);
            comp.comment = this.file.absoluteURI;
            return comp;
        };
        RPPLoader.prototype.createComp = function (addMuteTracks) {
            var duration = reduce(this.items, function (duration, item) {
                if (item.isMute() && !addMuteTracks) {
                    return duration;
                }
                return Math.max(duration, item.getOutPoint());
            }, 0);
            return app.project.items.addComp(this.file.displayName, this.size[0] || 1280, this.size[1] || 720, 1, duration, this.framerate);
        };
        RPPLoader.prototype.createLayers = function (comp, analyzer, _a) {
            var sort = _a.sort, addMuteTracks = _a.addMuteTracks;
            var avStore = {};
            var items = sort.orderBy === OrderBy.Time ? this.items.slice().sort(function (lhs, rhs) {
                return lhs.getInPoint() - rhs.getInPoint();
            }) : this.items;
            for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
                var item = items_2[_i];
                if (analyzer.containsIGUID(item.getIGUID())) {
                    continue;
                }
                else if (item.isMute() && !addMuteTracks) {
                    continue;
                }
                var sourceType = item.getSourceType();
                if (sourceType === 'MIDI' || sourceType === 'EMPTY') {
                    continue;
                }
                var filePath = item.getFilePath();
                var avItem = null;
                switch (sourceType) {
                    case 'RPP_PROJECT':
                        avItem = avStore[filePath] || (avStore[filePath] = this.importRPP(filePath, sort, addMuteTracks));
                        break;
                    default:
                        avItem = avStore[filePath] || (avStore[filePath] = this.importItem(filePath));
                        break;
                }
                var layer = comp.layers.add(avItem);
                try {
                    item.arrange(layer, { orderType: sort.orderType });
                }
                catch (e) {
                    layer.label = 1;
                    layer.marker.setValueAtTime(0, new MarkerValue(e.message));
                }
            }
            //add render file
            if (this.renderFile) {
                if (!analyzer.containsMasterLayer()) {
                    var filePath = this.renderFile;
                    try {
                        var avItem = avStore[filePath] || (avStore[filePath] = this.importItem(filePath, false));
                        var renderLayer = comp.layers.add(avItem);
                        renderLayer.comment = RPPLoader.MASTER_TRACK_COMMENT;
                        renderLayer.name = 'Master';
                        if (renderLayer.outPoint > comp.duration) {
                            comp.duration = renderLayer.outPoint;
                        }
                    }
                    catch (e) {
                        //pass
                    }
                }
            }
        };
        RPPLoader.prototype.importRPP = function (path, sort, addMuteTracks) {
            var file = getFileByPath(path, this.file.parent.absoluteURI);
            if (!file.exists) {
                throw new Error("Not found: ".concat(path));
            }
            var contents = RPPLoader.loadContents(file);
            if (!contents) {
                throw "".concat(path, " isn't a RPP file");
            }
            var newLoader = new RPPLoader;
            newLoader.load(file, contents);
            var item = newLoader.execute({
                target: Target.Auto,
                sort: sort,
                addMuteTracks: addMuteTracks,
            }, true);
            return item;
        };
        RPPLoader.prototype.importItem = function (path, placeholder) {
            if (placeholder === void 0) { placeholder = true; }
            var file = getFileByPath(path, this.file.parent.absoluteURI);
            if (!file.exists) {
                if (placeholder) {
                    return this.importPlaceholder(file, path);
                }
                throw new Error("Not found: ".concat(path));
            }
            return getFootageItem(function (item) { return item.file && item.file.absoluteURI === file.absoluteURI; }) || app.project.importFile(new ImportOptions(file));
        };
        RPPLoader.prototype.importPlaceholder = function (file, path) {
            var items = filter(this.items, function (item) { return item.getFilePath() === path; });
            var duration = reduce(items, function (duration, item) { return Math.max(duration, item.getEstimatedDuration()); }, 0);
            return app.project.importPlaceholder(file.displayName, this.size[0], this.size[1], this.framerate, duration);
        };
        RPPLoader.prototype.createTempo = function (comp, analyzer) {
            var _this = this;
            if (this.tempo.length !== 3) {
                return;
            }
            else if (analyzer.containsTempoLayer()) {
                return;
            }
            var _a = this.tempo, bpm = _a[0], beats = _a[1], note = _a[2];
            var tempoLayer = comp.layers.addNull();
            tempoLayer.enabled = false;
            tempoLayer.comment = RPPLoader.TEMPO_TRACK_COMMENT;
            tempoLayer.name = "".concat(bpm, " ").concat(beats, "/").concat(note);
            var marker = tempoLayer.property('ADBE Marker');
            var duration = comp.duration;
            if (!this.tempos.length) {
                var bps = bpm / 60 * (note / 4);
                for (var i = 0;; ++i) {
                    var time = i / bps;
                    if (time > duration) {
                        break;
                    }
                    var beat = (i % beats) + 1;
                    var markerValue = new MarkerValue("".concat(beat));
                    marker.setValueAtTime(time, markerValue);
                }
            }
            else {
                var signature_1 = { num: beats, den: note };
                var beat = 0;
                var b1_1 = 0;
                var _loop_1 = function (i, total) {
                    var _b, _c;
                    var tempo = this_1.tempos[i];
                    var endTime = i < total - 1 ? this_1.tempos[i + 1].time : duration;
                    if (tempo.signature) {
                        beat = 0;
                        b1_1 = 0;
                        signature_1 = tempo.signature;
                    }
                    var t2b = null;
                    var b2t = null;
                    if (tempo.shape === 0 /* Shape.Linear */ && i < total - 1) {
                        _b = (function () {
                            var nextTempo = _this.tempos[i + 1];
                            var s1 = tempo.bpm / 60 * (signature_1.den / 4);
                            var s2 = nextTempo.bpm / 60 * (signature_1.den / 4);
                            var t1 = tempo.time;
                            var t2 = nextTempo.time;
                            var ds = s2 - s1;
                            var dt = t2 - t1;
                            var v = ds / dt;
                            var u = s1 - v * t1;
                            var w = u / v;
                            var C = b1_1 - v / 2 * t1 * t1 - u * t1;
                            var sign = ds > 0 ? 1 : -1;
                            return [
                                function (time) {
                                    return v / 2 * time * time + u * time + C;
                                },
                                function (beat) {
                                    return sign * Math.sqrt(2 / v * (beat - C) + w * w) - w;
                                },
                            ];
                        })(), t2b = _b[0], b2t = _b[1];
                    }
                    else {
                        _c = (function () {
                            var s = tempo.bpm / 60 * (signature_1.den / 4);
                            var t = tempo.time;
                            var a = 1 / s;
                            var b = tempo.time - b1_1 / s;
                            return [
                                function (time) {
                                    return s * (time - t) + b1_1;
                                },
                                function (beat) {
                                    return a * beat + b;
                                },
                            ];
                        })(), t2b = _c[0], b2t = _c[1];
                    }
                    var first = true;
                    while (true) {
                        var t = b2t(beat);
                        if (t >= endTime) {
                            b1_1 = t2b(endTime);
                            break;
                        }
                        var b = (beat % signature_1.num) + 1;
                        var markerValue = null;
                        if (first && tempo.signature) {
                            first = false;
                            markerValue = new MarkerValue("".concat(b, " | ").concat(signature_1.num, " / ").concat(signature_1.den));
                        }
                        else {
                            markerValue = new MarkerValue("".concat(b));
                        }
                        marker.setValueAtTime(t, markerValue);
                        beat++;
                    }
                };
                var this_1 = this;
                for (var i = 0, total = this.tempos.length; i < total; i++) {
                    _loop_1(i, total);
                }
            }
        };
        RPPLoader.prototype.createMarkers = function (comp) {
            if (this.markers.length) {
                var marker = comp.markerProperty;
                for (var _i = 0, _a = this.markers; _i < _a.length; _i++) {
                    var _b = _a[_i], time = _b.time, text = _b.text;
                    marker.setValueAtTime(time, new MarkerValue(text));
                }
            }
        };
        RPPLoader.MASTER_TRACK_COMMENT = '[Master Track]';
        RPPLoader.TEMPO_TRACK_COMMENT = '[Tempo Track]';
        return RPPLoader;
    }());
    var loader = new RPPLoader;
    var builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, function (win) {
        win.spacing = win.margins = 2;
    })
        .addPanel(Param.LoadPanel, 'Load', undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'column';
        ui.preferredSize[0] = 230;
        ui.spacing = 5;
        ui.margins = 7;
    })
        .addGroup(Param.PathGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addEditText(Param.Path, '', undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Reaper project path';
    })
        .addButton(Param.BrowsePath, '...', undefined, function (ui, emitter) {
        ui.alignment = ['right', 'top'];
        ui.preferredSize = [20, 25];
        ui.helpTip = 'Browse a reaper project path';
        ui.onClick = function () {
            var path = builder.get(Param.Path);
            var file = null;
            if (path) {
                file = new File(path).openDlg('Reaper Project', '*.rpp');
            }
            else {
                var projectFile = app.project.file;
                if (projectFile) {
                    file = (new File(projectFile.parent.absoluteURI)).openDlg('Reaper Project', '*.rpp');
                }
                else {
                    file = File.openDialog('Reaper Project', '*.rpp');
                }
            }
            if (file) {
                builder.set(Param.Path, file.fsName);
                if (file.exists) {
                    emitter.notify(Event.Load);
                }
            }
        };
    })
        .addGroupEnd()
        .addButton(Param.Load, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Load';
        ui.onClick = function () {
            emitter.notify(Event.Load);
        };
        emitter.addEventListener(Event.Load, function () {
            var filePath = builder.get(Param.Path);
            if (!filePath) {
                return;
            }
            var file = new File(filePath);
            if (!file.exists) {
                alert("".concat(file.displayName, " doesn't exist"));
                return;
            }
            var contents = RPPLoader.loadContents(file);
            if (!contents) {
                alert('Invalid rpp file');
                return;
            }
            var _a = loader.load(file, contents), itemNum = _a.itemNum, activeItemNum = _a.activeItemNum, framerate = _a.framerate, size = _a.size;
            builder.set(Param.Info, "item: ".concat(itemNum, "(active: ").concat(activeItemNum, "), size: [").concat(size[0], ", ").concat(size[1], "], fps: ").concat(framerate));
        });
    })
        .addStaticText(Param.Info, undefined, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
    })
        .addPanelEnd()
        .addPanel(Param.ExecutePanel, 'Execute', undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'column';
        ui.preferredSize[0] = 230;
        ui.spacing = 5;
        ui.margins = 7;
    })
        .addDropDownList(Param.Target, values(Target), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.selection = 0;
    })
        .addGroup(Param.SortGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addDropDownList(Param.OrderBy, values(OrderBy), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Order By';
        ui.preferredSize[0] = 100;
        ui.selection = 0;
    })
        .addDropDownList(Param.OrderType, values(OorderType), undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.preferredSize[0] = 100;
        ui.selection = 0;
    })
        .addGroupEnd()
        .addGroup(Param.OptionsGroup, undefined, function (ui) {
        ui.alignment = ['fill', 'top'];
        ui.orientation = 'row';
        ui.spacing = ui.margins = 1;
    })
        .addCheckbox(Param.AddMuteTracks, false, 'Add Mute Tracks', undefined, function (ui) {
        ui.alignment = ['fill', 'bottom'];
        ui.helpTip = 'Add Mute Tracks';
        ui.preferredSize[0] = 100;
    })
        .addGroupEnd()
        .addButton(Param.Execute, undefined, undefined, function (ui, emitter) {
        ui.alignment = ['fill', 'top'];
        ui.helpTip = 'Execute';
        ui.onClick = function () {
            if (!loader.valid()) {
                return;
            }
            try {
                app.beginUndoGroup(SCRIPT_NAME);
                var comp = loader.execute({
                    target: builder.get(Param.Target),
                    sort: {
                        orderBy: builder.get(Param.OrderBy),
                        orderType: builder.get(Param.OrderType),
                    },
                    addMuteTracks: builder.get(Param.AddMuteTracks),
                });
                if (comp) {
                    comp.openInViewer();
                }
            }
            catch (e) {
                alert(e);
            }
            finally {
                app.endUndoGroup();
            }
        };
    })
        .addPanelEnd()
        .build();
})(this);
