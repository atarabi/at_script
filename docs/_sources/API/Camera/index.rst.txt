=========
Camera
=========

Camera.getDefaultCameraDistanceToImagePlane()
---------------------------------------------

``getDefaultCameraDistanceToImagePlane(comp: CompItem): number;``

コンポのデフォルトのカメラの位置からイメージプレーンまでの距離を取得する。

参照: `AEGP_GetDefaultCameraDistanceToImagePlane <https://ae-plugins.docsforadobe.dev/artisans/artisan-data-types/?h=AEGP_GetDefaultCameraDistanceToImagePlane#aegp_camerasuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const distance = Atarabi.camera.getDefaultCameraDistanceToImagePlane(comp);
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var distance = Atarabi.camera.getDefaultCameraDistanceToImagePlane(comp);
        }

.. versionadded:: 0.2.0

Camera.getFilmSize()
---------------------------------------------

``getFilmSize(cameraLayer: CameraLayer): FilmSize;``

カメラのフィルムサイズを取得する。

参照: `AEGP_GetCameraFilmSize <https://ae-plugins.docsforadobe.dev/artisans/artisan-data-types/?h=AEGP_GetCameraFilmSize#aegp_camerasuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const camera = comp.activeCamera;
            if (camera) {
                const filmSize = Atarabi.camera.getFilmSize(camera);
            }
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var camera = comp.activeCamera;
            if (camera) {
                var filmSize = Atarabi.camera.getFilmSize(camera);
            }
        }

.. versionadded:: 0.2.0

Camera.setFilmSize()
---------------------------------------------

``setFilmSize(cameraLayer: CameraLayer, filmSize: FilmSize): void;``

カメラのフィルムサイズを設定する。

参照: `AEGP_SetCameraFilmSize <https://ae-plugins.docsforadobe.dev/artisans/artisan-data-types/?h=AEGP_SetCameraFilmSize#aegp_camerasuite2>`_

.. tabs::

    .. code-tab:: TypeScript

        const comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            const camera = comp.activeCamera;
            if (camera) {
                Atarabi.camera.setFilmSize(camera, { unit: 'Vertical', size: 500 });
            }
        }

    .. code-tab:: JavaScript

        var comp = Atarabi.comp.getMostRecentlyUsedComp();
        if (comp) {
            var camera = comp.activeCamera;
            if (camera) {
                Atarabi.camera.setFilmSize(camera, { unit: 'Vertical', size: 500 });
            }
        }

.. versionadded:: 0.2.0
