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
