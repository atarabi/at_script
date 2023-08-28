/**
 * @still_maker v1.0.0
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@still_maker';

    const DEFAULT_IMAGE_PATH = new File(`${(Folder.desktop.absoluteURI)}/[name]_##.[ext]`).fsName;

    enum Param {
        PathGroup = 'PathGroup',
        Path = 'Path',
        BrowsePath = 'BrowsePath',
        Target = 'Target',
        OptionsGroup = 'OptionsGroup',
        Type = 'Extension',
        Downsample = 'Downsample',
        Make = 'Make',
    }

    enum Event {
        SaveSetting = 'SaveSetting',
        UpdateType = 'UpdateType',
    };

    const Target = {
        Comp: 'Composition',
        Layer: 'A Selected Layer',
    } as const;

    const Type = {
        Png: 'PNG',
        Jpeg: 'JPEG',
        Hdr: 'HDR',
        Clipboard: 'Clipboard',
    } as const;

    const Downsample = {
        Full: 'Full',
        Half: 'Half',
        Third: 'Third',
        Quarter: 'Quarter',
        Fifth: 'Fifth',
        Sixth: 'Sixth',
        Seventh: 'Seventh',
        Eighth: 'Eighth',
    } as const;

    function convertDownsample(downsample: string) {
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

    function values<T>(obj: { [s: string]: T }): T[] {
        const arr: T[] = [];
        for (const key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    }

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }

    function zfill(number: number, size: number, ch: string = '0') {
        let s = '' + number;
        while (s.length < size) {
            s = ch + s;
        }
        return s;
    }

    function createFolder(folder: Folder) {
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

    function replaceFile(file: File, name: string, ext: string) {
        let fsName = file.fsName.replace(/\[name\]/g, name).replace(/\[ext\]/g, ext);
        const m = fsName.match(/#+/);
        if (m) {
            const len = m[0].length;
            const prefix = fsName.substr(0, m.index);
            const suffix = fsName.substr(m.index + len);
            for (let i = 1, mx = Math.pow(10, len); i < mx; i++) {
                let newFsName = prefix + zfill(i, len) + suffix;
                let newFile = new File(newFsName);
                if (!newFile.exists) {
                    return newFile;
                }
            }
        }
        return new File(fsName);
    }

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, win => {
        win.spacing = win.margins = 1;
    })
        .addGroup(Param.PathGroup, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.preferredSize[0] = 230;
            ui.spacing = ui.margins = 1;
        })
        .addEditText(Param.Path, DEFAULT_IMAGE_PATH, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Still image path';
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
            emitter.addEventListener(Event.UpdateType, (type: string) => {
                ui.enabled = type !== Type.Clipboard;
            });
        })
        .addButton(Param.BrowsePath, '...', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize = [20, 25];
            ui.helpTip = 'Browse a still image path';
            ui.onClick = () => {
                const path = builder.get(Param.Path);
                const file = path ? new File(path).openDlg('Still image path', '*.png;*.jpg') as File : File.openDialog('Still image path', '*.png;*.jpg') as File;
                if (file) {
                    builder.set(Param.Path, file.fsName);
                    emitter.notify(Event.SaveSetting);
                }
            };
            emitter.addEventListener(Event.UpdateType, (type: string) => {
                ui.enabled = type !== Type.Clipboard;
            });
        })
        .addGroupEnd()
        .addDropDownList(Param.Target, values(Target), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Target';
            ui.selection = 0;
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addGroup(Param.OptionsGroup, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addDropDownList(Param.Type, values(Type), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Type';
            ui.selection = 0;
            ui.onChange = () => {
                if (builder) {
                    emitter.notify(Event.UpdateType, builder.get(Param.Type));
                }
                emitter.notify(Event.SaveSetting);
            };
        })
        .addDropDownList(Param.Downsample, values(Downsample), undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize[0] = 70;
            ui.helpTip = 'Downsample';
            ui.selection = 0;
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addGroupEnd()
        .addButton(Param.Make, undefined, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.onClick = () => {
                const comp = app.project.activeItem;
                if (!(comp instanceof CompItem)) {
                    return;
                }
                try {
                    const target = builder.get(Param.Target);
                    const type = builder.get(Param.Type);
                    const downsample = convertDownsample(builder.get(Param.Downsample) as string);
                    let path = builder.get(Param.Path);
                    if (!path) {
                        return;
                    }
                    if (path.indexOf('[project]') >= 0) {
                        const projectFile = app.project.file;
                        if (!projectFile) {
                            throw 'Please save this project';
                        }
                        path = path.replace(/\[project\]/g, projectFile.parent.fsName);
                    }
                    let file = new File(path);

                    switch (target) {
                        case Target.Comp: {
                            switch (type) {
                                case Type.Png:
                                    file = replaceFile(file, comp.name, 'png');
                                    if (file.exists) {
                                        if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                            return;
                                        }
                                    }
                                    createFolder(file.parent);
                                    Atarabi.comp.saveFrameToPng(comp, file, { downsample });
                                    break;
                                case Type.Jpeg:
                                    file = replaceFile(file, comp.name, 'jpg');
                                    if (file.exists) {
                                        if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                            return;
                                        }
                                    }
                                    createFolder(file.parent);
                                    Atarabi.comp.saveFrameToJpg(comp, file, { downsample, quality: 100 });
                                    break;
                                case Type.Hdr:
                                    file = replaceFile(file, comp.name, 'hdr');
                                    if (file.exists) {
                                        if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                            return;
                                        }
                                    }
                                    createFolder(file.parent);
                                    Atarabi.comp.saveFrameToHdr(comp, file, { downsample });
                                    break;
                                case Type.Clipboard:
                                    Atarabi.comp.saveFrameToClipboard(comp, { downsample });
                                    break;
                            }
                            break;
                        }
                        case Target.Layer: {
                            const layer = comp.selectedLayers[0];
                            if (isAVLayer(layer)) {
                                switch (type) {
                                    case Type.Png:
                                        file = replaceFile(file, layer.name, 'png');
                                        if (file.exists) {
                                            if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                                return;
                                            }
                                        }
                                        createFolder(file.parent);
                                        Atarabi.layer.saveFrameToPng(layer, file, { downsample });
                                        break;
                                    case Type.Jpeg:
                                        file = replaceFile(file, layer.name, 'jpg');
                                        if (file.exists) {
                                            if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                                return;
                                            }
                                        }
                                        createFolder(file.parent);
                                        Atarabi.layer.saveFrameToJpg(layer, file, { downsample, quality: 100 });
                                        break;
                                    case Type.Hdr:
                                        file = replaceFile(file, layer.name, 'hdr');
                                        if (file.exists) {
                                            if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                                return;
                                            }
                                        }
                                        createFolder(file.parent);
                                        Atarabi.layer.saveFrameToHdr(layer, file, { downsample });
                                        break;
                                    case Type.Clipboard:
                                        Atarabi.layer.saveFrameToClipboard(layer, { downsample });
                                        break;
                                }
                            }
                            break;
                        }
                    }
                } catch (err) {
                    alert(err);
                }
            };
        })
        .addEventListener(Event.SaveSetting, () => {
            if (builder) {
                builder.saveToSetting(`@script/${SCRIPT_NAME}`, 'settings');
            }
        })
        .build();

    builder.onInit(builder => {
        builder.loadFromSetting(`@script/${SCRIPT_NAME}`, 'settings');
        if (!builder.get(Param.Path)) {
            builder.set(Param.Path, DEFAULT_IMAGE_PATH);
        }
        builder.notify(Event.UpdateType, builder.get(Param.Type));
    });

})(this);