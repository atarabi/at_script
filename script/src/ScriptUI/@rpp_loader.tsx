/**
 * @rpp_loader v1.1.0
 * 
 *      v1.1.0(2024/10/22)  Add undo group
 *      v1.0.1(2023/10/08)  Fix empty source
 *      v1.0.0(2023/08/28)
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@rpp_loader';

    enum Param {
        LoadPanel = 'LoadPanel',
        PathGroup = 'Path Group',
        Path = 'Path',
        BrowsePath = 'BrowsePath',
        Load = 'Load',
        Info = 'Info',
        ExecutePanel = 'ExecutePanel',
        Target = 'Target',
        SortGroup = 'Sort Group',
        OrderBy = 'OrderBy',
        OrderType = 'OorderType',
        OptionsGroup = 'OptionsGroup',
        AddMuteTracks = 'AddMuteTracks',
        Execute = 'Execute',
    }

    enum Event {
        Load = 'Load',
    }

    const Target = {
        Auto: 'Auto',
        NewComp: 'New Comp',
        ActiveComp: 'Active Comp',
    } as const;

    const OrderBy = {
        Track: 'Track',
        Time: 'Time',
    } as const;

    const OorderType = {
        ASC: 'Ascending',
        DESC: 'Descending',
    } as const;

    // Utility
    function filter<T>(values: any[], fn: (value: any) => boolean): T[] {
        const arr: T[] = [];
        for (const value of values) {
            if (fn(value)) {
                arr.push(value);
            }
        }
        return arr;
    }

    function map<T, U>(array: T[], fn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
        const result: U[] = [];
        for (let i = 0; i < array.length; i++) {
            result.push(fn(array[i], i, array));
        }
        return result;
    }

    function some<T>(array: T[], fn: (value: T) => boolean): boolean {
        for (const value of array) {
            if (fn(value)) {
                return true;
            }
        }
        return false;
    }

    function reduce<T, U>(arr: T[], fn: (prev: U, cur: T, index?: number, arr?: T[]) => U, initialValue: U): U {
        const l = arr.length;
        if (!l) {
            return initialValue;
        }
        let i = 0;
        let value = initialValue;
        while (i < l) {
            value = fn(value as U, arr[i], i, arr);
            ++i;
        }
        return value;
    }

    function isArray<T>(arg: any): arg is T[] {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };

    function values<T>(obj: { [s: string]: T }): T[] {
        const arr: T[] = [];
        for (const key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    }

    function clamp(v: number, mn: number, mx: number) {
        return Math.max(mn, Math.min(mx, v));
    }

    function getCompItem(cond: (item: CompItem) => boolean): CompItem | null {
        const project = app.project;
        for (let i = 1; i <= project.numItems; i++) {
            const item = project.item(i);
            if (item instanceof CompItem && cond(item)) {
                return item;
            }
        }
        return null;
    }

    function getFootageItem(cond: (item: FootageItem) => boolean): FootageItem | null {
        const project = app.project;
        for (let i = 1; i <= project.numItems; i++) {
            const item = project.item(i);
            if (item instanceof FootageItem && cond(item)) {
                return item;
            }
        }
        return null;
    }

    function getActiveComp(): CompItem | null {
        const comp = app.project.activeItem;
        if (comp instanceof CompItem) {
            return comp;
        }
        return null;
    }

    function getFileByPath(path: string, baseUri: string): File {
        let file = new File(path);
        if (!file.exists) {
            const relativeFile = new File(baseUri);
            relativeFile.changePath(path);
            if (relativeFile.exists) {
                file = relativeFile;
            }
        }
        return file;
    }

    // RPP
    const RPP_HEADER = '<REAPER_PROJECT';

    enum RPPType {
        NONE = -1,
        SECTION_START,
        PROPERTY,
        DATA,
        SECTION_END,
    }

    const RPPParser = (line: string): { type: RPPType; name?: string; values?: any[]; } => {
        line = line.replace(/^\s+|\s+$/g, '');
        if (!line.length) {
            return { type: RPPType.NONE };
        }

        let type = RPPType.NONE;
        let name: string = '';
        let values: any[] = null;

        let head = line[0];
        let pos = 0;
        const end = line.length;
        if (head === '<') {
            type = RPPType.SECTION_START;
            ++pos;
        } else if (head === '>') {
            type = RPPType.SECTION_END;
        } else {
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
                const sep = ((head: string) => {
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

                let value = '';
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

        return { type, name, values };
    };

    class RPPSection {
        public name: string = '';
        public values: any[] = [];
        public properties: { [name: string]: any[][] } = {};
        public data: string = '';
        public children: { [name: string]: RPPSection[] } = {};
        constructor(name: string, values: any[]) {
            this.name = name;
            this.values = values;
        }
        load(lines: string[], row: number) {
            for (const total = lines.length; row < total; ++row) {
                const { type, name, values } = RPPParser(lines[row]);
                if (type === RPPType.SECTION_START) {
                    const section = new RPPSection(name, values);
                    if (!this.children[name]) {
                        this.children[name] = [];
                    }
                    this.children[name].push(section);
                    row = section.load(lines, row + 1);
                } else if (type === RPPType.PROPERTY) {
                    if (!this.properties[name]) {
                        this.properties[name] = [];
                    }
                    this.properties[name].push(values);
                } else if (type === RPPType.DATA) {
                    this.data += name;
                } else if (type === RPPType.SECTION_END) {
                    break;
                }
            }
            return row;
        }
    }

    class RPPItem {
        private position: number;
        private length: number;
        private mute: boolean;
        private trackMute: boolean;
        private iguid: string;
        private name: string;
        private soffs: number;
        private playrate: number;
        private sourceType: string;
        private file: string;
        private sm: {x: number; y: number; z?: number;}[];
        constructor(section: RPPSection, trackMute: boolean) {
            this.position = +section.properties['POSITION'][0][0];
            this.length = +section.properties['LENGTH'][0][0];
            this.mute = +section.properties['MUTE'][0][0] === 1;
            this.trackMute = trackMute;
            this.iguid = section.properties['IGUID'][0][0];
            this.name = section.properties['NAME'] ? section.properties['NAME'][0][0] : '';
            this.soffs = section.properties['SOFFS'] ? +section.properties['SOFFS'][0][0] : 0;
            this.playrate = section.properties['PLAYRATE'] ? +section.properties['PLAYRATE'][0][0] : 1;
            if (section.children['SOURCE']) {
                let source = section.children['SOURCE'][0];
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
                const sms = section.properties['SM'] ? section.properties['SM'][0] : [];
                const sm: number[] = [];
                for (const v of sms) {
                    if (v === '+') {
                        if (sm.length === 2) {
                            this.sm.push({ x: sm[0], y: sm[1] });
                        } else if (sm.length === 3) {
                            this.sm.push({ x: sm[0], y: sm[1], z: sm[2] });
                        } else {
                            // TODO: error
                        }
                        sm.splice(0);
                    } else {
                        const n = parseFloat(v);
                        if (!isNaN(n)) {
                            sm.push(n);
                        }
                    }
                }
            } else {
                this.sourceType = 'EMPTY';
            }
        }
        getSourceType() {
            return this.sourceType;
        }
        isMute() {
            return this.mute || this.trackMute;
        }
        getIGUID() {
            return this.iguid;
        }
        getInPoint() {
            return this.position;
        }
        getOutPoint() {
            return this.position + this.length;
        }
        getEstimatedDuration() {
            return (this.length + this.soffs) * this.playrate;
        }
        getFilePath() {
            return this.file;
        }
        arrange(layer: AVLayer, { orderType }: {
            orderType: string;
        }) {
            layer.enabled = layer.audioEnabled = !this.isMute();
            if (orderType === OorderType.ASC) {
                layer.moveToEnd();
            } else {
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
                const timeRemap = layer.property('ADBE Time Remapping') as Property;
                const minTime = timeRemap.keyValue(1) as number;
                const maxTime = timeRemap.keyValue(2) as number;
                const inPoint = layer.inPoint;
                const outPoint = layer.outPoint;
                const timeAtOutPoint = (timeRemap.valueAtTime(outPoint, true) as number) - (timeRemap.valueAtTime(inPoint, true) as number);
                const convert = (() => {
                    const comp = layer.containingComp;
                        const frameDuration = comp.frameDuration;
                        return (time: number) => {
                            const frames = Math.round(time / frameDuration);
                            return frames * frameDuration;
                        };
                })();
                for (let {x, y} of this.sm) {
                    x = (outPoint - inPoint) / timeAtOutPoint * x + inPoint;
                    timeRemap.setValueAtTime(convert(x), clamp(y, minTime, maxTime));
                }
            }
        }
    }

    class CompAnalyzer {
        static GUID_REGEX = /(\{[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\})/i;
        private iguids: { [guid: string]: Layer; } = {};
        private masterLayer: Layer = null;
        private tempoLayer: Layer = null;
        constructor(comp: CompItem) {
            //comp
            for (let i = 1; i <= comp.numLayers; i++) {
                const layer = comp.layer(i);
                const comment = layer.comment;
                const m = CompAnalyzer.GUID_REGEX.exec(comment);
                if (m) {
                    const iguid = m[1];
                    this.iguids[iguid] = layer;
                } else if (comment.indexOf(RPPLoader.MASTER_TRACK_COMMENT) >= 0) {
                    this.masterLayer = layer;
                } else if (comment.indexOf(RPPLoader.TEMPO_TRACK_COMMENT) >= 0) {
                    this.tempoLayer = layer;
                }
            }
        }
        containsIGUID(iguid: string) {
            return !!this.iguids[iguid];
        }
        containsMasterLayer() {
            return !!this.masterLayer;
        }
        getMasterLayer() {
            return this.masterLayer;
        }
        containsTempoLayer() {
            return !!this.tempoLayer;
        }
        getTempoLayer() {
            return this.tempoLayer;
        }
    }

    type Signature = { num: number; den: number; };

    const enum Shape {
        Linear,
        Square,
    }

    type Tempo = { time: number; bpm: number; shape: number; signature?: Signature };

    class RPPLoader {
        static loadContents(file: File) {
            if (!file.exists) {
                return '';
            }
            let contents = '';
            file.encoding = 'UTF-8';
            if (file.open('r')) {
                let header = file.read(RPP_HEADER.length);
                if (header === RPP_HEADER) {
                    contents = header + file.read();
                }
                file.close();
            }
            return contents;
        }
        static MASTER_TRACK_COMMENT = '[Master Track]';
        static TEMPO_TRACK_COMMENT = '[Tempo Track]';
        private file: File = null;
        private size: [number, number, number] = [1280, 720, 0];
        private framerate: number = 30;
        private renderFile: string = '';
        private items: RPPItem[] = [];
        private tempo: number[] = [];
        private tempos: Tempo[] = [];
        private markers: { time: number; text: string; }[] = [];
        private clear() {
            this.file = null;
            this.size = [1280, 720, 0];
            this.framerate = 30;
            this.renderFile = '';
            this.items = [];
            this.tempo = [];
            this.markers = [];
        }
        load(file: File, contents: string) {
            this.clear();

            this.file = file;

            //build tree
            const lines = contents.split(/\n/);
            const rootResult = RPPParser(lines[0]);
            const root = new RPPSection(rootResult.name, rootResult.values);
            root.load(lines, 1);

            //items
            let mutes: boolean[] = [false];
            let prevIsbus: [number, number] = [0, 0];
            const tracks = root.children['TRACK'];
            if (isArray(tracks)) {
                for (const track of tracks) {
                    const mute = track.properties['MUTESOLO'][0][0] === '1';
                    const isbus = map(track.properties['ISBUS'][0], val => +val) as [number, number];
                    const [cmd, delta] = prevIsbus;
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
                    const trackMute = some(mutes, mute => mute);
                    const items = track.children['ITEM'] || [];
                    for (const item of items) {
                        const rppItem = new RPPItem(item, trackMute);
                        this.items.push(rppItem);
                    }
                }
            }

            //size
            if (root.properties['VIDEO_CONFIG']) {
                this.size = map(root.properties['VIDEO_CONFIG'][0], val => +val) as [number, number, number];
            }

            //framerate
            if (root.properties['SMPTESYNC']) {
                this.framerate = +root.properties['SMPTESYNC'][0][1];
            }

            //render file
            if (root.properties['RENDER_FILE'] && root.properties['RENDER_FILE'][0][0]) {
                this.renderFile = root.properties['RENDER_FILE'][0][0];
            } else if (root.properties['RENDER_PATTERN'] && root.properties['RENDER_PATTERN'][0][0]) {
                const pattern = root.properties['RENDER_PATTERN'][0][0];
                const files = this.file.parent.getFiles(`${pattern}.*`) as File[];
                for (let file of files) {
                    if (/\.(wav|mp3|flac)$/i.test(file.displayName)) {
                        this.renderFile = file.absoluteURI;
                        break;
                    }
                }
            }

            //tempo
            if (root.properties['TEMPO']) {
                this.tempo = map(root.properties['TEMPO'][0], val => +val);
            }

            //tempos
            if (root.children['TEMPOENVEX']) {
                const PTs = root.children['TEMPOENVEX'][0].properties['PT'];
                if (isArray(PTs)) {
                    for (const PT of PTs) {
                        const time = parseFloat(PT[0]);
                        const bpm = parseFloat(PT[1]);
                        const shape = parseInt(PT[2], 10);
                        if (PT[3] && parseInt(PT[3], 10) > 0) {
                            const signature = parseInt(PT[3], 10);
                            this.tempos.push({ time, bpm, shape, signature: { num: (signature) & 0xFFFF, den: (signature >> 16) & 0xFFFF } })
                        } else {
                            this.tempos.push({ time, bpm, shape })
                        }
                    }
                }
            }

            //markers
            if (root.properties['MARKER']) {
                this.markers = map(root.properties['MARKER'], (values: any[]) => {
                    return { time: +values[1], text: values[2] };
                });
            }

            return {
                itemNum: this.items.length,
                activeItemNum: reduce(this.items, (total: number, item: RPPItem) => {
                    if (!item.isMute()) {
                        return total + 1;
                    }
                    return total;
                }, 0),
                framerate: this.framerate,
                size: this.size,
            };
        }
        valid(): boolean {
            return this.file !== null;
        }
        execute({ target, sort, addMuteTracks }: {
            target: string;
            sort: { orderBy: string; orderType: string; };
            addMuteTracks: boolean;
        }, isChild = false): CompItem {
            let comp: CompItem = null;
            if (target === Target.Auto) {
                comp = getCompItem((item: CompItem) => item.comment === this.file.absoluteURI);
                if (!comp) {
                    comp = this.createComp(isChild ? true : addMuteTracks);
                }
            } else if (target === Target.NewComp) {
                comp = this.createComp(addMuteTracks);
            } else if (target === Target.ActiveComp) {
                comp = getActiveComp();
            } else {
                return null;
            }
            const analyzer = new CompAnalyzer(comp);
            this.createLayers(comp, analyzer, { sort, addMuteTracks });
            this.createTempo(comp, analyzer);
            this.createMarkers(comp);
            comp.comment = this.file.absoluteURI;
            return comp;
        }
        private createComp(addMuteTracks: boolean) {
            const duration: number = reduce(this.items, (duration: number, item: RPPItem) => {
                if (item.isMute() && !addMuteTracks) {
                    return duration;
                }
                return Math.max(duration, item.getOutPoint());
            }, 0);
            return app.project.items.addComp(this.file.displayName, this.size[0] || 1280, this.size[1] || 720, 1, duration, this.framerate);
        }
        private createLayers(comp: CompItem, analyzer: CompAnalyzer, { sort, addMuteTracks }: {
            sort: { orderBy: string; orderType: string; };
            addMuteTracks: boolean;
        }) {
            const avStore: { [file: string]: AVItem } = {};
            const items = sort.orderBy === OrderBy.Time ? this.items.slice().sort((lhs: RPPItem, rhs: RPPItem) => {
                return lhs.getInPoint() - rhs.getInPoint();
            }) : this.items;
            for (const item of items) {
                if (analyzer.containsIGUID(item.getIGUID())) {
                    continue;
                } else if (item.isMute() && !addMuteTracks) {
                    continue;
                }
                const sourceType = item.getSourceType();
                if (sourceType === 'MIDI' || sourceType === 'EMPTY') {
                    continue;
                }
                const filePath = item.getFilePath();
                let avItem: AVItem = null;
                switch (sourceType) {
                    case 'RPP_PROJECT':
                        avItem = avStore[filePath] || (avStore[filePath] = this.importRPP(filePath, sort, addMuteTracks));
                        break;
                    default:
                        avItem = avStore[filePath] || (avStore[filePath] = this.importItem(filePath));
                        break;
                }
                const layer = comp.layers.add(avItem);
                try {
                    item.arrange(layer, { orderType: sort.orderType });
                } catch (e) {
                    layer.label = 1;
                    layer.marker.setValueAtTime(0, new MarkerValue(e.message));
                }
            }
            //add render file
            if (this.renderFile) {
                if (!analyzer.containsMasterLayer()) {
                    const filePath = this.renderFile;
                    try {
                        const avItem = avStore[filePath] || (avStore[filePath] = this.importItem(filePath, false));
                        const renderLayer = comp.layers.add(avItem);
                        renderLayer.comment = RPPLoader.MASTER_TRACK_COMMENT;
                        renderLayer.name = 'Master';
                        if (renderLayer.outPoint > comp.duration) {
                            comp.duration = renderLayer.outPoint;
                        }
                    } catch (e) {
                        //pass
                    }
                }
            }
        }
        private importRPP(path: string, sort: { orderBy: string; orderType: string; }, addMuteTracks: boolean, ): AVItem {
            const file = getFileByPath(path, this.file.parent.absoluteURI);
            if (!file.exists) {
                throw new Error(`Not found: ${path}`);
            }
            const contents = RPPLoader.loadContents(file);
            if (!contents) {
                throw `${path} isn't a RPP file`;
            }
            const newLoader = new RPPLoader;
            newLoader.load(file, contents);
            const item = newLoader.execute({
                target: Target.Auto,
                sort,
                addMuteTracks,
            }, true);
            return item;
        }
        private importItem(path: string, placeholder = true): AVItem {
            const file = getFileByPath(path, this.file.parent.absoluteURI);
            if (!file.exists) {
                if (placeholder) {
                    return this.importPlaceholder(file, path);
                }
                throw new Error(`Not found: ${path}`);
            }
            return getFootageItem((item: FootageItem) => item.file && item.file.absoluteURI === file.absoluteURI) || app.project.importFile(new ImportOptions(file)) as FootageItem;
        }
        private importPlaceholder(file: File, path: string): AVItem {
            const items = filter(this.items, (item: RPPItem) => item.getFilePath() === path);
            const duration = reduce(items, (duration: number, item: RPPItem) => Math.max(duration, item.getEstimatedDuration()), 0);
            return app.project.importPlaceholder(file.displayName, this.size[0], this.size[1], this.framerate, duration);
        }
        private createTempo(comp: CompItem, analyzer: CompAnalyzer) {
            if (this.tempo.length !== 3) {
                return;
            } else if (analyzer.containsTempoLayer()) {
                return;
            }

            const [bpm, beats, note] = this.tempo;
            const tempoLayer = comp.layers.addNull();
            tempoLayer.enabled = false;
            tempoLayer.comment = RPPLoader.TEMPO_TRACK_COMMENT;
            tempoLayer.name = `${bpm} ${beats}/${note}`;
            const marker = tempoLayer.property('ADBE Marker') as Property;
            const duration = comp.duration;
            if (!this.tempos.length) {
                const bps = bpm / 60 * (note / 4);
                for (let i = 0; ; ++i) {
                    const time = i / bps;
                    if (time > duration) {
                        break;
                    }
                    const beat = (i % beats) + 1;
                    const markerValue = new MarkerValue(`${beat}`);
                    marker.setValueAtTime(time, markerValue);
                }
            } else {
                let signature: Signature = { num: beats, den: note };
                let beat = 0;
                let b1 = 0;
                for (let i = 0, total = this.tempos.length; i < total; i++) {
                    const tempo = this.tempos[i];
                    const endTime = i < total - 1 ? this.tempos[i + 1].time : duration;
                    if (tempo.signature) {
                        beat = 0;
                        b1 = 0;
                        signature = tempo.signature;
                    }
                    let t2b: (time: number) => number = null;
                    let b2t: (beat: number) => number = null;
                    if (tempo.shape === Shape.Linear && i < total - 1) {
                        [t2b, b2t] = (() => {
                            const nextTempo = this.tempos[i + 1];
                            const s1 = tempo.bpm / 60 * (signature.den / 4);
                            const s2 = nextTempo.bpm / 60 * (signature.den / 4);
                            const t1 = tempo.time;
                            const t2 = nextTempo.time;
                            const ds = s2 - s1;
                            const dt = t2 - t1;
                            const v = ds / dt;
                            const u = s1 - v * t1;
                            const w = u / v;
                            const C = b1 - v / 2 * t1 * t1 - u * t1
                            const sign = ds > 0 ? 1 : -1;
                            return [
                                (time: number) => {
                                    return v / 2 * time * time + u * time + C;
                                },
                                (beat: number) => {
                                    return sign * Math.sqrt(2 / v * (beat - C) + w * w) - w;
                                },
                            ];
                        })();
                    } else {
                        [t2b, b2t] = (() => {
                            const s = tempo.bpm / 60 * (signature.den / 4);
                            const t = tempo.time;
                            const a = 1 / s;
                            const b = tempo.time - b1 / s;
                            return [
                                (time: number) => {
                                    return s * (time - t) + b1;
                                },
                                (beat: number) => {
                                    return a * beat + b;
                                },
                            ];
                        })();
                    }
                    let first = true;
                    while (true) {
                        const t = b2t(beat);
                        if (t >= endTime) {
                            b1 = t2b(endTime);
                            break;
                        }
                        const b = (beat % signature.num) + 1;
                        let markerValue: MarkerValue = null;
                        if (first && tempo.signature) {
                            first = false;
                            markerValue = new MarkerValue(`${b} | ${signature.num} / ${signature.den}`);
                        } else {
                            markerValue = new MarkerValue(`${b}`);
                        }
                        marker.setValueAtTime(t, markerValue);
                        beat++;
                    }
                }
            }
        }
        private createMarkers(comp: CompItem) {
            if (this.markers.length) {
                const marker = comp.markerProperty;
                for (const { time, text } of this.markers) {
                    marker.setValueAtTime(time, new MarkerValue(text));
                }
            }
        }
    }

    const loader = new RPPLoader;

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 2;
    })
        .addPanel(Param.LoadPanel, 'Load', undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'column';
            ui.preferredSize[0] = 230;
            ui.spacing = 5;
            ui.margins = 7;
        })
        .addGroup(Param.PathGroup, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addEditText(Param.Path, '', undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Reaper project path';
        })
        .addButton(Param.BrowsePath, '...', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize = [20, 25];
            ui.helpTip = 'Browse a reaper project path';
            ui.onClick = () => {
                const path = builder.get(Param.Path) as string;
                let file: File = null;
                if (path) {
                    file =new File(path).openDlg('Reaper Project', '*.rpp') as File;
                } else {
                    const projectFile = app.project.file;
                    if (projectFile) {
                        file = (new File(projectFile.parent.absoluteURI)).openDlg('Reaper Project', '*.rpp') as File;
                    } else {
                        file = File.openDialog('Reaper Project', '*.rpp') as File;
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
        .addButton(Param.Load, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Load';
            ui.onClick = () => {
                emitter.notify(Event.Load);
            };
            emitter.addEventListener(Event.Load, () => {
                const filePath = builder.get(Param.Path);
                if (!filePath) {
                    return;
                }
                const file = new File(filePath);
                if (!file.exists) {
                    alert(`${file.displayName} doesn't exist`)
                    return;
                }
                const contents = RPPLoader.loadContents(file);
                if (!contents) {
                    alert('Invalid rpp file');
                    return;
                }
                const { itemNum, activeItemNum, framerate, size } = loader.load(file, contents);
                builder.set(Param.Info, `item: ${itemNum}(active: ${activeItemNum}), size: [${size[0]}, ${size[1]}], fps: ${framerate}`);
            });
        })
        .addStaticText(Param.Info, undefined, undefined, ui => {
            ui.alignment = ['fill', 'top'];
        })
        .addPanelEnd()
        .addPanel(Param.ExecutePanel, 'Execute', undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'column';
            ui.preferredSize[0] = 230;
            ui.spacing = 5;
            ui.margins = 7;
        })
        .addDropDownList(Param.Target, values(Target), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.selection = 0;
        })
        .addGroup(Param.SortGroup, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addDropDownList(Param.OrderBy, values(OrderBy), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Order By';
            ui.preferredSize[0] = 100;
            ui.selection = 0;
        })
        .addDropDownList(Param.OrderType, values(OorderType), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 100;
            ui.selection = 0;
        })
        .addGroupEnd()
        .addGroup(Param.OptionsGroup, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addCheckbox(Param.AddMuteTracks, false, 'Add Mute Tracks', undefined, ui => {
            ui.alignment = ['fill', 'bottom'];
            ui.helpTip = 'Add Mute Tracks';
            ui.preferredSize[0] = 100;
        })
        .addGroupEnd()
        .addButton(Param.Execute, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Execute';
            ui.onClick = () => {
                if (!loader.valid()) {
                    return;
                }
                try {
                    app.beginUndoGroup(SCRIPT_NAME);
                    const comp = loader.execute({
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
                } catch (e) {
                    alert (e);
                } finally {
                    app.endUndoGroup();
                }
            };
        })
        .addPanelEnd()
        .build()
        ;

})(this);