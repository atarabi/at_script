declare namespace PF {

    // https://ae-plugins.docsforadobe.dev/effect-basics/parameters/#parameter-types
    const enum ParamType {
        Reserved = -1,
        Layer = 0,
        Slider,
        FixedSlider,
        Angle,
        Checkbox,
        Color,
        Point,
        Popup,
        Custom,
        NoData,
        FloatSlider,
        ArbitraryData,
        Path,
        GroupStart,
        GroupEnd,
        Button,
        Reserved2,
        Reserved3,
        Point3D,
    }

    // https://ae-plugins.docsforadobe.dev/effect-basics/PF_ParamDef/?h=pf_paramdef#parameter-ui-flags
    const enum ParamUIFlags {
        None = 0,
        Topic = 1 << 0,
        Control = 1 << 1,
        StdControlOnly = 1 << 2,
        NoEcwUi = 1 << 3,
        EcwSeparator = 1 << 4,
        Disabled = 1 << 5,
        DontEraseTopic = 1 << 6,
        DontEraseControl = 1 << 7,
        RadioButton = 1 << 8,
        Invisible = 1 << 9,
    }

    // https://ae-plugins.docsforadobe.dev/effect-basics/PF_ParamDef/?h=pf_paramdef#parameter-flags
    const enum ParamFlags {
        None = 0,
        Reserved1 = 1 << 0,
        CannotTimeVary = 1 << 1,
        CannotInterp = 1 << 2,
        Reserved2 = 1 << 3,
        Reserved3 = 1 << 4,
        CollapseTwirly = 1 << 5,
        Supervise = 1 << 6,
        StartCollapsed = CollapseTwirly,
        UseValueForOldProjects = 1 << 7,
        LayerParamIsTrackmatte = 1 << 7,
        ExcludeFromHaveInputsChanged = 1 << 8,
        SkipRevealWhenUnhiddn = 1 << 9,
    }

    // https://ae-plugins.docsforadobe.dev/effect-basics/PF_ParamDef/?h=pf_paramdef#pf_valuedisplayflags
    const enum ValueDisplayFlags {
        None = 0,
        Percent = 1 << 0,
        Pixel = 1 << 1,
        Reserved1 = 1 << 2,
        Reverse = 1 << 3,
    }

    // https://ae-plugins.docsforadobe.dev/effect-basics/PF_EffectWorld/#pf_effectworld-structure
    const enum LayerDefault {
        Myself = -1,
        None = 0,
    }

}