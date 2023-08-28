/**
 * @movie_maker v1.0.0
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@movie_maker';

    const DEFAULT_IMAGE_PATH = new File(`${(Folder.desktop.absoluteURI)}/[name]_##.[ext]`).fsName;

    enum Param {
        PathGroup = 'PathGroup',
        Path = 'Path',
        BrowsePath = 'BrowsePath',
        Type = 'Extension',
        TargetGroup = 'TargetGroup',
        Target = 'Target',
        Area = 'Area',
        OptionsGroup = 'OptionsGroup',
        Downsample = 'Downsample',
        Skip = 'Skip',
        Speed = 'Speed',
        Make = 'Make',
    }

    enum Event {
        SaveSetting = 'SaveSetting',
    }

    const Type = {
        Gif: 'GIF',
        Apng: 'APNG',
    } as const;

    const Target = {
        Comp: 'Composition',
        Layer: 'A Selected Layer',
    } as const;

    const Area = {
        WorkArea: 'Work Area',
        LengthOfComp: 'Length of Comp',
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

    function replaceFile(file: File, name: string, ext: string) {
        let displayName = file.displayName.replace(/\[name\]/g, name).replace(/\[ext\]/g, ext);
        const m = displayName.match(/#+/);
        if (m) {
            const len = m[0].length;
            const prefix = displayName.substr(0, m.index);
            const suffix = displayName.substr(m.index + len);
            for (let i = 1, mx = Math.pow(10, len); i < mx; i++) {
                let newDisplayName = prefix + zfill(i, len) + suffix;
                let newFile = new File(`${file.parent.absoluteURI}/${newDisplayName}`);
                if (!newFile.exists) {
                    return newFile;
                }
            }
        }
        return new File(`${file.parent.absoluteURI}/${displayName}`);
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
            ui.helpTip = 'A image path';
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addButton(Param.BrowsePath, '...', undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize = [20, 25];
            ui.helpTip = 'Browse a image path';
            ui.onClick = () => {
                const path = builder.get(Param.Path);
                const file = path ? new File(path).openDlg('A image path', '*.gif;*.png') as File : File.openDialog('A image path', '*.gif;*.png') as File;
                if (file) {
                    builder.set(Param.Path, file.fsName);
                    emitter.notify(Event.SaveSetting);
                }
            };
        })
        .addDropDownList(Param.Type, values(Type), undefined, (ui, emitter) => {
            ui.alignment = ['right', 'top'];
            ui.preferredSize[0] = 60;
            ui.helpTip = 'Type';
            ui.selection = 0;
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addGroupEnd()
        .addGroup(Param.TargetGroup, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addDropDownList(Param.Target, values(Target), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Target';
            ui.selection = 0;
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addDropDownList(Param.Area, values(Area), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.helpTip = 'Area';
            ui.selection = 0;
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addGroupEnd()
        .addGroup(Param.OptionsGroup, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.orientation = 'row';
            ui.spacing = ui.margins = 1;
        })
        .addDropDownList(Param.Downsample, values(Downsample), undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 70;
            ui.helpTip = 'Downsample';
            ui.selection = 0;
            ui.onChange = () => {
                emitter.notify(Event.SaveSetting);
            };
        })
        .addNumber(Param.Skip, { initialvalue: 0, minvalue: 0, maxvalue: 10 }, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 50;
            ui.helpTip = 'Skip';
            ui.onChange = () => {
                builder.set(Param.Skip, Math.round(builder.get(Param.Skip)));
                emitter.notify(Event.SaveSetting);
            };
        })
        .addNumber(Param.Speed, { initialvalue: 1, minvalue: 0.01, maxvalue: 5 }, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 50;
            ui.helpTip = 'Speed';
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
                    const area = builder.get(Param.Area);
                    const downsample = convertDownsample(builder.get(Param.Downsample) as string);
                    const skip = builder.get(Param.Skip);
                    const speed = builder.get(Param.Speed);
                    let startTime = 0, endTime = 0;
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
                                case Type.Gif:
                                    file = replaceFile(file, comp.name, 'gif');
                                    if (file.exists) {
                                        if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                            return;
                                        }
                                    }
                                    Atarabi.comp.saveFramesToGif(comp, startTime, endTime, file, { downsample, skip, speed });
                                    break;
                                case Type.Apng:
                                    file = replaceFile(file, comp.name, 'png');
                                    if (file.exists) {
                                        if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                            return;
                                        }
                                    }
                                    Atarabi.comp.saveFramesToApng(comp, startTime, endTime, file, { downsample, skip, speed });
                                    break;
                            }
                            break;
                        }
                        case Target.Layer: {
                            const layer = comp.selectedLayers[0];
                            if (isAVLayer(layer)) {
                                switch (type) {
                                    case Type.Gif:
                                        file = replaceFile(file, layer.name, 'gif');
                                        if (file.exists) {
                                            if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                                return;
                                            }
                                        }
                                        Atarabi.layer.saveFramesToGif(layer, startTime, endTime, file, { downsample, skip, speed });
                                        break;
                                    case Type.Apng:
                                        file = replaceFile(file, layer.name, 'png');
                                        if (file.exists) {
                                            if (!confirm(`Overwrite "${file.displayName}"?`)) {
                                                return;
                                            }
                                        }
                                        Atarabi.layer.saveFramesToApng(layer, startTime, endTime, file, { downsample, skip, speed });
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
    });

})(this);