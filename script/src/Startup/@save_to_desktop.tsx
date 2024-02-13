/**
 * @save_to_desktop v1.0.1
 * 
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/09/16)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    Atarabi.keyboard.hook({ code: 'S', altKey: true }, ctx => {
        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name.replace(/\//g, '-')}_${Date.now()}.png`);
            Atarabi.comp.saveFrameToPng(comp, file);
        }
        return true;
    });

})();