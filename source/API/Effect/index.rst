=======
Effect
=======

Effect.updateParamUI()
-----------------------

``updateParamUI(effect: PropertyGroup): void;``

対象のエフェクトに対して、 **PF_Cmd_UPDATE_PARAMS_UI** コマンドを発火させる。パラメータの値によって表示、非表示が変わるようなエフェクトに対して実行することで、UIの再描写を促すことが出来る。

参照: `PF_Cmd_UPDATE_PARAMS_UI <https://ae-plugins.docsforadobe.dev/effect-details/parameter-supervision.html?highlight=PF_Cmd_UPDATE_PARAMS_UI#updating-parameter-ui>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const properties = comp.selectedProperties;
            for (const property of properties) {
                if (property instanceof PropertyGroup && property.isEffect) {
                    Atarabi.effect.updateParamUI(property);
                }
            }
        }

    .. code-tab:: JavaScript
	
        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var properties = comp.selectedProperties;
            for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                var property = properties_1[_i];
                if (property instanceof PropertyGroup && property.isEffect) {
                    Atarabi.effect.updateParamUI(property);
                }
            }
        }

Effect['ADBE CurvesCustom'].getCurvesValue()
---------------------------------------------

``getCurvesValue(curvesProperty: Property, options?: { time?: number; preExpression?: boolean; }): Curves.CurvesValue;``

トーンカーブの値を取得する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                const properties = comp.selectedProperties;
                for (const property of properties) {
                    if (property.matchName === 'ADBE CurvesCustom-0001') {
                        const value = Atarabi.effect['ADBE CurvesCustom'].getCurvesValue(property as Property);
                        alert(Atarabi.JSON.stringify(value, undefined, 2));
                    }
                }
            }
        })();

    .. code-tab:: JavaScript
	
        (function () {
            var comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                var properties = comp.selectedProperties;
                for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
                    var property = properties_2[_i];
                    if (property.matchName === 'ADBE CurvesCustom-0001') {
                        var value = Atarabi.effect['ADBE CurvesCustom'].getCurvesValue(property);
                        alert(Atarabi.JSON.stringify(value, undefined, 2));
                    }
                }
            }
        })();

.. versionadded:: 0.4.0

Effect['ADBE CurvesCustom'].setCurvesValue()
---------------------------------------------

``setCurvesValue(curvesProperty: Property, value: Curves.ParticalCurvesValue, options?: { time?: number; key?: boolean; }): void;``

トーンカーブの値を設定する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                const value: Atarabi.Effect.Curves.ParticalCurvesValue= {
                    type: 'curve',
                    rgb: [[0, 0], [0.25, 0.15], [0.75, 0.85], [1, 1]],
                };

                const properties = comp.selectedProperties;
                for (const property of properties) {
                    if (property.matchName === 'ADBE CurvesCustom-0001') {
                        Atarabi.effect['ADBE CurvesCustom'].setCurvesValue(property as Property, value);
                    }
                }
            }
        })();

    .. code-tab:: JavaScript
	
        (function () {
            var comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                var value = {
                    type: 'curve',
                    rgb: [[0, 0], [0.25, 0.15], [0.75, 0.85], [1, 1]],
                };
                var properties = comp.selectedProperties;
                for (var _i = 0, properties_3 = properties; _i < properties_3.length; _i++) {
                    var property = properties_3[_i];
                    if (property.matchName === 'ADBE CurvesCustom-0001') {
                        Atarabi.effect['ADBE CurvesCustom'].setCurvesValue(property, value);
                    }
                }
            }
        })();

.. versionadded:: 0.4.0

Effect['APC Colorama'].getOutputCycleValue()
---------------------------------------------

``getOutputCycleValue(outputCycleProperty: Property, options?: { time?: number; preExpression?: boolean; }): Colorama.OutputCycleValue;``

コロラマの出力サイクルの値を取得する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                const properties = comp.selectedProperties;
                for (const property of properties) {
                    if (property.matchName === 'APC Colorama-0012') {
                        const value = Atarabi.effect['APC Colorama'].getOutputCycleValue(property as Property);
                        alert(Atarabi.JSON.stringify(value, undefined, 2));
                    }
                }
            }
        })();

    .. code-tab:: JavaScript
	
        (function () {
            var comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                var properties = comp.selectedProperties;
                for (var _i = 0, properties_4 = properties; _i < properties_4.length; _i++) {
                    var property = properties_4[_i];
                    if (property.matchName === 'APC Colorama-0012') {
                        var value = Atarabi.effect['APC Colorama'].getOutputCycleValue(property);
                        alert(Atarabi.JSON.stringify(value, undefined, 2));
                    }
                }
            }
        })();

.. versionadded:: 0.4.0

Effect['APC Colorama'].setOutputCycleValue()
---------------------------------------------

``setOutputCycleValue(outputCycleProperty: Property, value: Colorama.OutputCycleValue, options?: { time?: number; key?: boolean; }): void;``

コロラマの出力サイクルの値を設定する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                const value: Atarabi.Effect.Colorama.OutputCycleValue = {
                    triangles: [],
                    selected: 0,
                };
            
                for (let i = 0; i < 64; ++i) {
                    value.triangles.push({ location: i / 63, color: [1, generateRandomNumber(), generateRandomNumber(), 1] });
                }
            
                const properties = comp.selectedProperties;
                for (const property of properties) {
                    if (property.matchName === 'APC Colorama-0012') {
                        Atarabi.effect['APC Colorama'].setOutputCycleValue(property as Property, value);
                    }
                }
            }
        })();

    .. code-tab:: JavaScript
	
        (function () {
            var comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                var value = {
                    triangles: [],
                    selected: 0,
                };
                for (var i = 0; i < 64; ++i) {
                    value.triangles.push({ location: i / 63, color: [1, generateRandomNumber(), generateRandomNumber(), 1] });
                }
                var properties = comp.selectedProperties;
                for (var _i = 0, properties_5 = properties; _i < properties_5.length; _i++) {
                    var property = properties_5[_i];
                    if (property.matchName === 'APC Colorama-0012') {
                        Atarabi.effect['APC Colorama'].setOutputCycleValue(property, value);
                    }
                }
            }
        })();

.. versionadded:: 0.4.0
