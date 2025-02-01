/**
 * @paste_clipboard v1.0.0
 */
(() => {

    /**********************************/
    const ENABLE_AT_IAMGE = true;
    /**********************************/

    const SCRIPT_NAME = '@paste_clipboard';

    const HOOK_SOLID = '@hook_solid';
    const ADD_SOLID = 'addSolid';
    const AT_IMAGE = 'Atarabi_image';
    const IMAGE_PARAM = 'Atarabi_image-0001';
    const MODE_PARAM = 'Atarabi_image-0007';
    const enum Mode {
        None = 0,
        Offset = 1,
        Transform = 2,
    }
    const BLENDING_MODE_PARAM = 'Atarabi_image-0018';
    const enum BlendingMode {
        None = 1,
    }

    Atarabi.keyboard.hook({ code: 'V', altKey: true }, ctx => {
        const activeItem = app.project.activeItem;
        const comp: CompItem = activeItem instanceof CompItem ? activeItem : null;
        const folder: FolderItem = activeItem instanceof FolderItem ? activeItem : null;

        if (Atarabi.API.isAdded('@svg', 'svgToShapeLayer')) {
            const types = Atarabi.clipboard.getTypes();
            let isSVG = false;
            for (const type of types) {
                if (type.indexOf('Scalable Vector Graphics') >= 0 || type.indexOf('com.adobe.illustrator.svg') >= 0) {
                    isSVG = true;
                    break;
                }
            }
    
            if (isSVG) {
                const text = Atarabi.clipboard.getText();
                if (startsWith(text, '<?xml')) {
                    try {
                        app.beginUndoGroup(SCRIPT_NAME);
                        const layer = comp.selectedLayers[0];
                        Atarabi.API.invoke('@svg', 'svgToShapeLayer', [text, layer instanceof ShapeLayer ? layer : null]);
                    } catch (e) {
                        alert(e);
                    }  finally {
                        app.endUndoGroup();
                    }
                    return true;
                }
            }
        }

        const files = Atarabi.clipboard.getFiles();
        if (files.length) {
            const targets: { ffx?: File; item?: FootageItem; options?: ImportOptions; }[] = [];
            const items = collectFootageItems();
            for (const file of files) {
                if (!file.exists) {
                    continue;
                }
                if (file instanceof File) {
                    if (items.hasOwnProperty(file.absoluteURI)) {
                        if (comp) {
                            targets.push({ item: items[file.absoluteURI] });
                        }
                        continue;
                    }
                    if (/\.ffx$/i.test(file.displayName)) {
                        if (comp) {
                            targets.push({ ffx: file });
                        }
                        continue;
                    }
                    const options = new ImportOptions(file);
                    if (options.canImportAs(ImportAsType.COMP) || options.canImportAs(ImportAsType.COMP_CROPPED_LAYERS) || options.canImportAs(ImportAsType.FOOTAGE) || options.canImportAs(ImportAsType.FOOTAGE)) {
                        targets.push({ options });
                    }
                } else {
                    const files = sortFilesInFolder(file);
                    for (const { file, sequence } of files) {
                        if (items.hasOwnProperty(file.absoluteURI)) {
                            if (comp) {
                                targets.push({ item: items[file.absoluteURI] });
                            }
                            continue;
                        }
                        const options = new ImportOptions(file);
                        if (options.canImportAs(ImportAsType.COMP) || options.canImportAs(ImportAsType.COMP_CROPPED_LAYERS) || options.canImportAs(ImportAsType.FOOTAGE) || options.canImportAs(ImportAsType.FOOTAGE)) {
                            if (sequence) {
                                options.sequence = true;
                            }
                            targets.push({ options });
                        }
                    }
                }
            }
            if (targets.length) {
                try {
                    app.beginUndoGroup(SCRIPT_NAME);
                    let topLayer: Layer = (() => {
                        if (!comp) {
                            return null;
                        }
                        const layers = comp.selectedLayers.slice();
                        if (!layers.length) {
                            return null;
                        }
                        layers.sort((lhs, rhs) => {
                            return lhs.index - rhs.index;
                        });
                        return layers[0];
                    })();
                    for (const { ffx, item, options } of targets) {
                        let layer: Layer = null;
                        if (ffx) {
                            if (comp) {
                                const layer = comp.selectedLayers[0];
                                if (layer) {
                                    layer.applyPreset(ffx);
                                }
                            }
                        } else if (item) {
                            if (comp) {
                                layer = comp.layers.add(item);
                            }
                        } else if (options) {
                            const item = app.project.importFile(options);
                            if (comp) {
                                if (item instanceof CompItem || item instanceof FootageItem) {
                                    layer = comp.layers.add(item);
                                }
                            } else if (folder) {
                                item.parentFolder = folder;
                            }
                        }
                        if (layer && comp) {
                            layer.startTime = comp.time;
                            if (topLayer) {
                                layer.moveBefore(topLayer);
                            }
                            topLayer = layer;
                        }
                    }
                } catch (e) {
                    alert(e);
                } finally {
                    app.endUndoGroup();
                }
                return true;
            }
        }

        if (ENABLE_AT_IAMGE) {
            const info = Atarabi.clipboard.getImageInfo();
            if (info) {
                try {
                    app.beginUndoGroup(SCRIPT_NAME);
                    if (!applyToProperty(comp) && !applyToLayer(comp)) {
                        const name = `Clipboard ${formatDate(new Date)}`;
                        let targetComp = comp;
                        if (!targetComp) {
                            targetComp = app.project.items.addComp(name, info.width, info.height, 1, 10, 30);
                            targetComp.openInViewer();
                        }
                        const solidLayer = addSolid(targetComp, info.width, info.height);
                        solidLayer.name = name;
                        solidLayer.selected = false;
                        const effect = solidLayer.effect.addProperty(AT_IMAGE) as PropertyGroup;
                        setImageFromClipboard(effect);
                        (effect(BLENDING_MODE_PARAM) as Property).setValue(BlendingMode.None);
                    }
                } catch (e) {
                    alert(e);
                } finally {
                    app.endUndoGroup();
                }
                return true;
            }
        }

        return false;
    });

    function startsWith(str: string, search: string, position = 0) {
        return str.substr(position, search.length) === search;
    }

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof AVLayer || layer instanceof TextLayer || layer instanceof ShapeLayer;
    }

    function formatDate(date: Date) {
        return `${date.getFullYear()}/${zfill(date.getMonth() + 1)}/${zfill(date.getDate())} ${zfill(date.getHours())}:${zfill(date.getMinutes())}:${zfill(date.getSeconds())}`;
    }

    function zfill(n: number) {
        const s = `0${n}`;
        return `0${n}`.substr(s.length - 2);
    }

    function collectFootageItems() {
        const items: { [path: string]: FootageItem } = {};
        const project = app.project;
        for (let i = 1; i <= project.numItems; i++) {
            const item = project.item(i);
            if (item instanceof FootageItem && item.file) {
                items[item.file.absoluteURI] = item;
            }
        }
        return items;
    }

    function addSolid(comp: CompItem, width: number, height: number) {
        return Atarabi.API.invoke(HOOK_SOLID, ADD_SOLID, [comp, width, height], (comp, width, height) => comp.layers.addSolid([1, 1, 1], `Solid (${width}x${height})`, width, height, 1));
    }

    function setImageFromClipboard(effect: PropertyGroup, mode: Mode = Mode.None) {
        Atarabi.at.setImageFromClipboard(effect(IMAGE_PARAM) as Property);
        if (mode != Mode.None) {
            (effect(MODE_PARAM) as Property).setValue(mode);
        }
    }

    function setImageFromFile(effect: PropertyGroup, file: File, mode: Mode = Mode.None) {
        Atarabi.at.setImageFromFile(effect(IMAGE_PARAM) as Property, file);
        if (mode != Mode.None) {
            (effect(MODE_PARAM) as Property).setValue(mode);
        }
    }

    function applyToProperty(comp: CompItem, file: File = null): boolean {
        if (!comp) {
            return false;
        }
        let effect: PropertyGroup = null;
        for (const property of comp.selectedProperties.slice()) {
            if (property.isEffect && property.matchName === AT_IMAGE) {
                effect = property as PropertyGroup;
                break;
            }
        }
        if (!effect) {
            return false;
        }
        if (file) {
            setImageFromFile(effect, file);
        } else {
            setImageFromClipboard(effect);
        }
        return true;
    }

    function applyToLayer(comp: CompItem, file: File = null): boolean {
        if (!comp) {
            return false;
        }
        const layer = comp.selectedLayers[0];
        if (!isAVLayer(layer)) {
            return false;
        }
        const effect = layer.effect.addProperty(AT_IMAGE) as PropertyGroup;
        if (file) {
            setImageFromFile(effect, file, Mode.Transform);
        } else {
            setImageFromClipboard(effect, Mode.Transform);
        }
        return true;
    }

    const MOVIE_EXTS = { 'mp4': true, 'mov': true, 'avi': true, 'mkv': true, 'wmv': true, 'flv': true, 'webm': true, 'm4v': true, 'mpg': true, 'mpeg': true, 'ts': true } as const;
    const AUDIO_EXTS = { 'wav': true, 'aiff': true, 'aif': true, 'flac': true, 'm4a': true, 'mp3': true, 'aac': true, 'ogg': true, 'opus': true, 'wma': true, } as const;

    function sortFilesInFolder(folder: Folder): { file: File; sequence: boolean; }[] {
        const re = /^(.*?)(\d+)\.(\w+)$/i;
        const store: { [key: string]: { file: File; index: number | null; count: number | null; }; } = {};

        for (const file of folder.getFiles()) {
            if (file instanceof Folder) {
                continue;
            }
            const m = file.displayName.match(re);
            if (m) {
                const ext = m[3].toLowerCase();
                if (MOVIE_EXTS.hasOwnProperty(ext) || AUDIO_EXTS.hasOwnProperty(ext)) {
                    store[file.displayName] = { file, index: null, count: null };
                } else {
                    const index = parseInt(m[2], 10);
                    const key = `${m[1]}/${m[3]}`;
                    if (store.hasOwnProperty(key)) {
                        if (index < store[key].index) {
                            store[key] = { file, index, count: store[key].count + 1 };
                        }
                    } else {
                        store[key] = { file, index, count: 1 };
                    }
                }
            } else {
                store[file.displayName] = { file, index: null, count: null };
            }
        }

        const result: { file: File; sequence: boolean; }[] = [];
        for (let key in store) {
            if (store.hasOwnProperty(key)) {
                if (typeof store[key].index === 'number' && store[key].count > 1) {
                    result.push({ file: store[key].file, sequence: true });
                } else {
                    result.push({ file: store[key].file, sequence: false });
                }
            }
        }
        return result;
    }

})();