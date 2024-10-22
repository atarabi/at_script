/**
 * @proxy_maker v1.0.0
 * 
 *      v1.0.0(2024/10/22)
 */
((global: Panel | Global) => {

    const SCRIPT_NAME = '@proxy_maker';

    const SIG = '@proxy';

    enum Param {
        Info = 'Info',
        Make = 'Make',
    }

    enum Event {
        Refresh = 'Refresh',
    }

    const builder = new Atarabi.UI.Builder(global instanceof Panel ? global : 'palette', SCRIPT_NAME, { resizeable: true }, (win, emitter) => {
        win.spacing = win.margins = 3;
        win.addEventListener('mouseover', () => {
            emitter.notify(Event.Refresh);
        });
    })
        .addStaticText(Param.Info, undefined, undefined, (ui, emitter) => {
            ui.alignment = ['fill', 'top'];
            ui.preferredSize[0] = 300;
            emitter.addEventListener(Event.Refresh, () => {
                const layer = getActiveAVLayer();
                if (!layer) {
                    builder.set(Param.Info, '');
                    return;
                }
                builder.set(Param.Info, `${layer.index}: ${layer.name}`);
            });
        })
        .addButton(Param.Make, undefined, undefined, ui => {
            ui.alignment = ['fill', 'top'];
            ui.onClick = () => {
                const layer = getActiveAVLayer();
                if (!layer) {
                    return;
                }
                const comp = layer.containingComp;

                const projectFile = app.project.file;
                if (!projectFile) {
                    return;
                }

                const projectFolder = projectFile.parent;
                const prefix = `${comp.id}_${Atarabi.layer.getID(layer)}`;
                const proxyFolder = new Folder(`${projectFolder.absoluteURI}/${SIG}/${prefix}`);
                createFolder(proxyFolder);
                const createFile = (frame: number) => new File(`${proxyFolder.absoluteURI}/${prefix}_${zfill(frame, 5)}.png`);

                try {
                    app.beginUndoGroup(SCRIPT_NAME);
                    const { workAreaStart, workAreaDuration, frameDuration } = comp;
                    const secondToFrame = (time: number) => Math.round(time / frameDuration);
                    const [workFrom, workTo] = [secondToFrame(workAreaStart), secondToFrame(workAreaStart + workAreaDuration)];
                    const { inPoint, outPoint } = layer;
                    const [from, to] = [secondToFrame(inPoint), secondToFrame(outPoint)];
                    Atarabi.UI.progress('making..', to - from, ctx => {
                        const frame = ctx.index + from;
                        const file = createFile(frame);
                        if (file.exists && (frame < workFrom || frame >= workTo)) {
                            return;
                        }
                        Atarabi.layer.saveFrameToPng(layer, file, { time: frame * frameDuration, downsample: 1 });
                    });
                    const proxyItem = importSequence(createFile(from), comp.frameRate);
                    const prevLayer = layer.index > 1 ? comp.layer(layer.index - 1) : null;
                    if (!(isAVLayer(prevLayer) && prevLayer.source === proxyItem)) {
                        layer.enabled = false;
                        const proxyLayer = comp.layers.add(proxyItem);
                        proxyLayer.startTime = inPoint;
                        proxyLayer.moveBefore(layer);
                    }
                } catch (err) {
                    alert(err);
                } finally {
                    app.endUndoGroup();
                }
            };
        })
        .build();

    function isAVLayer(layer: Layer): layer is AVLayer {
        return layer instanceof ShapeLayer || layer instanceof TextLayer || layer instanceof AVLayer;
    }

    function getActiveAVLayer() {
        const comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return null;
        }
        const layer = comp.selectedLayers[0];
        if (!isAVLayer(layer)) {
            return null;
        }
        return layer;
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

    function zfill(number: number, size: number, ch: string = '0') {
        let s = '' + number;
        while (s.length < size) {
            s = ch + s;
        }
        return s;
    }

    function findFolderItem(name: string) {
        for (let i = 1, total = app.project.numItems; i <= total; i++) {
            const item = app.project.item(i);
            if (item instanceof FolderItem && item.name === name) {
                return item;
            }
        }
        return app.project.items.addFolder(name);
    }

    function importSequence(file: File, frameRate: number) {
        const folder = file.parent.absoluteURI;
        for (let i = 1, total = app.project.numItems; i <= total; i++) {
            const item = app.project.item(i);
            if (!(item instanceof FootageItem)) {
                continue;
            }
            const itemFile = item.file;
            if (itemFile && folder === itemFile.parent.absoluteURI) {
                item.replaceWithSequence(file, false);
                (item.mainSource as FileSource).reload() 
                return item;
            }
        }
        const options = new ImportOptions(file);
        options.forceAlphabetical = false;
        options.sequence = true;
        const sequenceItem = app.project.importFile(options) as FootageItem;
        sequenceItem.mainSource.conformFrameRate = frameRate;
        sequenceItem.parentFolder = findFolderItem(SIG);
        return sequenceItem;
    }

})(this);