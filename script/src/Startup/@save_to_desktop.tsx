/**
 * @save_to_desktop v1.0.0
 */
(() => {

    Atarabi.keyboard.hook({ code: 'S', altKey: true }, ctx => {
        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const file = new File(`${Folder.desktop.absoluteURI}/${comp.name.replace(/\//g, '-')}_${Date.now()}.png`);
            Atarabi.comp.saveFrameToPng(comp, file);
        }
        return true;
    });

})();