/**
 * @toggle_mfr v1.0.0
 */
(() => {

    const SECTION = 'Concurrent Frame Rendering';
    const KEY = 'Enable Concurrent Frame Renders';

    Atarabi.keyboard.hook({ code: 'M', altKey: true }, ctx => {
        const now = app.preferences.getPrefAsBool(SECTION, KEY);
        app.preferences.savePrefAsBool(SECTION, KEY, !now);
        writeLn(`MFR: ${!now}`);
        return true;
    });

})();