/**
 * @toggle_mfr v1.0.1
 * 
 *      v1.0.1(2024/02/13) Fix dynamic link bug
 *      v1.0.0(2023/09/16)
 */
(() => {

    if (Atarabi.isDynamicLink()) {
        return;
    }

    const SECTION = 'Concurrent Frame Rendering';
    const KEY = 'Enable Concurrent Frame Renders';

    Atarabi.keyboard.hook({ code: 'M', altKey: true }, ctx => {
        const now = app.preferences.getPrefAsBool(SECTION, KEY);
        app.preferences.savePrefAsBool(SECTION, KEY, !now);
        writeLn(`MFR: ${!now}`);
        return true;
    });

})();