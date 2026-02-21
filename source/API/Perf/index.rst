===============
Perf
===============

Perf.Profiler.measure()
------------------------

``Profiler.measure(label: string, action: () => void, options?: ProfilerOptions): ProfileResult;``

ある関数の処理時間を計測する。

.. versionadded:: 0.8.0

Perf.Profiler.Perf.compare()
-----------------------------

``compare(entries: CompareEntry[], options?: ProfilerOptions): CompareResult;``

複数の関数の処理時間を比較する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {

            const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

            const chars = text.split('');

            Atarabi.perf.Profiler.compare([
                {
                    label: "charAt(i)",
                    action: function () {
                        for (let i = 0; i < text.length; i++) {
                            const ch = text.charAt(i);

                        }
                    },
                },
                {
                    label: "str[i]",
                    action: function () {
                        for (let i = 0; i < text.length; i++) {
                            const ch = text[i];
                        }
                    },
                },
                {
                    label: "arr[i] (pre-split)",
                    action: function () {
                        for (let i = 0; i < chars.length; i++) {
                            const ch = chars[i];
                        }
                    },
                },
                {
                    label: "arr[i] (with split)",
                    action: function () {
                        const chars = text.split('');
                        for (let i = 0; i < chars.length; i++) {
                            const ch = chars[i];
                        }
                    },
                },
            ]);

        })();

    .. code-tab:: JavaScript
                
        (function () {
            var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
            var chars = text.split('');
            Atarabi.perf.Profiler.compare([
                {
                    label: "charAt(i)",
                    action: function () {
                        for (var i = 0; i < text.length; i++) {
                            var ch = text.charAt(i);
                        }
                    },
                },
                {
                    label: "str[i]",
                    action: function () {
                        for (var i = 0; i < text.length; i++) {
                            var ch = text[i];
                        }
                    },
                },
                {
                    label: "arr[i] (pre-split)",
                    action: function () {
                        for (var i = 0; i < chars.length; i++) {
                            var ch = chars[i];
                        }
                    },
                },
                {
                    label: "arr[i] (with split)",
                    action: function () {
                        var chars = text.split('');
                        for (var i = 0; i < chars.length; i++) {
                            var ch = chars[i];
                        }
                    },
                },
            ]);
        })();

.. versionadded:: 0.8.0