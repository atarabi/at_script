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

    const MFR_SECTION = 'Concurrent Frame Rendering';
    const MFR_KEY = 'Enable Concurrent Frame Renders';

    Atarabi.keyboard.hook({ code: 'M', altKey: true }, ctx => {
        const now = app.preferences.getPrefAsBool(MFR_SECTION, MFR_KEY);
        app.preferences.savePrefAsBool(MFR_SECTION, MFR_KEY, !now);
        writeLn(`MFR: ${!now}`);
        return true;
    });

    const CACHE_SECTION = 'Speculative Preview Preference Section';
    const CACHE_KEY = 'Cache Frames When Idle';

    Atarabi.keyboard.hook({ code: 'M', altKey: true, ctrlKey: true }, ctx => {
        const now = app.preferences.getPrefAsBool(CACHE_SECTION, CACHE_KEY, PREFType.PREF_Type_MACHINE_INDEPENDENT);
        app.preferences.savePrefAsBool(CACHE_SECTION, CACHE_KEY, !now, PREFType.PREF_Type_MACHINE_INDEPENDENT);
        writeLn(`Cache Frames When Idle: ${!now}`);
        return true;
    });

})();