=======
Effect
=======

Effect.updateParamUI()
-----------------------

``updateParamUI(effect: PropertyGroup): void;``

対象のエフェクトに対して、 **PF_Cmd_UPDATE_PARAMS_UI** コマンドを発火させる。パラメータの値によって表示、非表示が変わるようなエフェクトに対して実行することで、UIの再描写を促すことが出来る。

参照: `PF_Cmd_UPDATE_PARAMS_UI <https://ae-plugins.docsforadobe.dev/effect-details/parameter-supervision/?h=PF_Cmd_UPDATE_PARAMS_UI#updating-parameter-ui>`_

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

Effect['ADBE MESH WARP'].getDistortionMeshValue()
-------------------------------------------------

``getDistortionMeshValue(distortionMeshProperty: Property, options?: { time?: number; preExpression?: boolean; }): MeshWarp.DistortionMeshValue;``

メッシュワープのディストーションメッシュの値を取得する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                const properties = comp.selectedProperties;
                for (const property of properties) {
                    if (property.matchName === 'ADBE MESH WARP-0004') {
                        const value = Atarabi.effect['ADBE MESH WARP'].getDistortionMeshValue(property as Property);
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
                for (var _i = 0, properties_6 = properties; _i < properties_6.length; _i++) {
                    var property = properties_6[_i];
                    if (property.matchName === 'ADBE MESH WARP-0004') {
                        var value = Atarabi.effect['ADBE MESH WARP'].getDistortionMeshValue(property);
                        alert(Atarabi.JSON.stringify(value, undefined, 2));
                    }
                }
            }
        })();

.. versionadded:: 0.5.0

Effect['ADBE MESH WARP'].setDistortionMeshValue()
-------------------------------------------------

``setDistortionMeshValue(distortionMeshProperty: Property, value: MeshWarp.DistortionMeshValue, options?: { time?: number; key?: boolean; }): void;``

メッシュワープのディストーションメッシュの値を設定する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const rows = 5;
            const columns = 5;
            const value: Atarabi.Effect.MeshWarp.DistortionMeshValue = {
                rows,
                columns,
                vertices: [],
            };

            const rand = (from: number, to: number) => from + (to - from) * generateRandomNumber();

            for (let y = 0; y < rows; ++y) {
                for (let x = 0; x < columns; ++x) {
                    const pos = [x / (columns - 1), y / (rows - 1)] satisfies [number, number];
                    value.vertices.push({
                        pos,
                        up: [pos[0] + rand(-0.05, 0.05), pos[1] + rand(-0.1, 0)],
                        right: [pos[0] + rand(0, 0.1), pos[1] + rand(-0.05, 0.05)],
                        down: [pos[0] + rand(-0.05, 0.05), pos[1] + rand(0.0, 0.1)],
                        left: [pos[0] + rand(-0.1, 0), pos[1] + rand(-0.05, 0.05)],
                    });
                }
            }

            const comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                const properties = comp.selectedProperties;
                for (const property of properties) {
                    if (property.matchName === 'ADBE MESH WARP-0004') {
                        Atarabi.effect['ADBE MESH WARP'].setDistortionMeshValue(property as Property, value);
                    }
                }
            }
        })();

    .. code-tab:: JavaScript
	
        (function () {
            var rows = 5;
            var columns = 5;
            var value = {
                rows: rows,
                columns: columns,
                vertices: [],
            };
            var rand = function (from, to) { return from + (to - from) * generateRandomNumber(); };
            for (var y = 0; y < rows; ++y) {
                for (var x = 0; x < columns; ++x) {
                    var pos = [x / (columns - 1), y / (rows - 1)];
                    value.vertices.push({
                        pos: pos,
                        up: [pos[0] + rand(-0.05, 0.05), pos[1] + rand(-0.1, 0)],
                        right: [pos[0] + rand(0, 0.1), pos[1] + rand(-0.05, 0.05)],
                        down: [pos[0] + rand(-0.05, 0.05), pos[1] + rand(0.0, 0.1)],
                        left: [pos[0] + rand(-0.1, 0), pos[1] + rand(-0.05, 0.05)],
                    });
                }
            }
            var comp = Atarabi.comp.getMostRecentlyUsedComp();
            if (comp) {
                var properties = comp.selectedProperties;
                for (var _i = 0, properties_7 = properties; _i < properties_7.length; _i++) {
                    var property = properties_7[_i];
                    if (property.matchName === 'ADBE MESH WARP-0004') {
                        Atarabi.effect['ADBE MESH WARP'].setDistortionMeshValue(property, value);
                    }
                }
            }
        })();

.. versionadded:: 0.5.0
