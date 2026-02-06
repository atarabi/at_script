/**
 * @save_to_desktop v1.1.0
 * 
 *      v1.1.0(2024/02/13) Refactored the regex for filenames
 *      v1.0.1(2024/02/13) Fixed a dynamic link bug
 *      v1.0.0(2023/09/16)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    Atarabi.keyboard.hook({ code: 'S', altKey: true }, ctx => {
        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name.replace(/[<>:"\/\\|?*]/g, '-')}_${Date.now()}.png`);
            Atarabi.comp.saveFrameToPng(comp, file);
        }
        return true;
    });

})();