/**
 * @save_to_desktop v1.1.0
 *
 *      v1.1.0(2024/02/13) Refactored the regex for filenames
 *      v1.0.1(2024/02/13) Fixed a dynamic link bug
 *      v1.0.0(2023/09/16)
 */
(function () {
    if (Atarabi.isDynamicLink()) {
        return;
    }
    Atarabi.keyboard.hook({ code: 'S', altKey: true }, function (ctx) {
        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var file = new File("".concat(Folder.desktop.absoluteURI, "/").concat(comp.name.replace(/[<>:"\/\\|?*]/g, '-'), "_").concat(Date.now(), ".png"));
            Atarabi.comp.saveFrameToPng(comp, file);
        }
        return true;
    });
})();
