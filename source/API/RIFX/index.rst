===============
RIFX
===============

aep(プロジェクト)やffx(プリセット)で使用されているRIFXというフォーマットを扱う。
ExtendScriptで実装しているので、大きなサイズのaepを扱うのには向いていない。

RIFX.stringify()
------------------------

``stringify(rifx: Chunk): string;``

parseしたChunkを元のバイナリに変換する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const file = new File('C:/adobe/my_preset.ffx');
            const chunk = Atarabi.RIFX.parse(file);
            const binary = Atarabi.RIFX.stringify(chunk);
        })();

    .. code-tab:: JavaScript
        
        (function () {
            var file = new File('C:/adobe/my_preset.ffx');
            var chunk = Atarabi.RIFX.parse(file);
            var binary = Atarabi.RIFX.stringify(chunk);
        })();

.. versionadded:: 0.5.0

RIFX.parse()
------------------------

``parse(file: File): Chunk;``  

``parse(text: string): Chunk;``

ファイルないしテキストをRIFXとして解析する。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const file = new File('C:/adobe/my_preset.ffx');
            const chunk = Atarabi.RIFX.parse(file);
        })();

    .. code-tab:: JavaScript
        
        (function () {
            var file = new File('C:/adobe/my_preset.ffx');
            var chunk = Atarabi.RIFX.parse(file);
        })();

.. versionadded:: 0.5.0

RIFX.parseWithXMP()
------------------------

``parseWithXMP(file: File): [Chunk, string];`` 

``parseWithXMP(text: string): [Chunk, string];``

ファイルないしテキストをRIFXとして解析することに加え、末尾についているXMPデータも返す。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const file = new File('C:/adobe/my_preset.ffx');
            const [chunk, xmp] = Atarabi.RIFX.parseWithXMP(file);
        })();

    .. code-tab:: JavaScript
        
        (function () {
            var file = new File('C:/adobe/my_preset.ffx');
            var _a = Atarabi.RIFX.parseWithXMP(file), chunk = _a[0], xmp = _a[1];
        })();

.. versionadded:: 0.5.0

RIFX.size()
------------------------

``size(chunk: RIFX.Chunk): number;``

チャンクのペイロードサイズを返す。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const file = new File('C:/adobe/my_preset.ffx');
            const chunk = Atarabi.RIFX.parse(file);
            const size = Atarabi.RIFX.size(chunk);
        })();

    .. code-tab:: JavaScript
        
        (function () {
            var file = new File('C:/adobe/my_preset.ffx');
            var chunk = Atarabi.RIFX.parse(file);
            var size = Atarabi.RIFX.size(chunk);
        })();
        
.. versionadded:: 0.5.0

RIFX.walk()
------------------------

``walk<C extends Chunk>(chunk: C, fn: (chunk: C | null) => boolean): void;``

チャンクを深さ優先でトラバースする。各チャンクに対しfn(chunk)が呼ばれた後、fn(null)が呼ばれる(golangのast.Inspectを参考にした)。

.. tabs::

    .. code-tab:: TypeScript

        (() => {
            const file = new File('C:/adobe/my_preset.ffx');
            const rifx = Atarabi.RIFX.parse(file);
            let i = 0;
            Atarabi.RIFX.walk(rifx, (chunk) => {
                if (chunk) {
                    i++;
                    const space = Array(i).join('  ');
                    if (chunk.id === 'RIFX' || chunk.id === 'LIST') {
                        $.writeln(`${space} ${chunk.id} ${chunk.data} (${Atarabi.RIFX.size(chunk)})`);
                    } else {
                        $.writeln(`${space}${chunk.id} (${Atarabi.RIFX.size(chunk)})`);
                    }
                } else {
                    i--;
                }
                return true;
            });
        })();

    .. code-tab:: JavaScript
        
        (function () {
            var file = new File('C:/adobe/my_preset.ffx');
            var rifx = Atarabi.RIFX.parse(file);
            var i = 0;
            Atarabi.RIFX.walk(rifx, function (chunk) {
                if (chunk) {
                    i++;
                    var space = Array(i).join('  ');
                    if (chunk.id === 'RIFX' || chunk.id === 'LIST') {
                        $.writeln("".concat(space, " ").concat(chunk.id, " ").concat(chunk.data, " (").concat(Atarabi.RIFX.size(chunk), ")"));
                    }
                    else {
                        $.writeln("".concat(space).concat(chunk.id, " (").concat(Atarabi.RIFX.size(chunk), ")"));
                    }
                }
                else {
                    i--;
                }
                return true;
            });
        })();

.. versionadded:: 0.5.0

RIFX.makeGradientPreset()
--------------------------

``makeGradientPreset(value: Property.GradientValue, type: Property.GradientType, key?: boolean): string;``

シェイプレイヤーのグラデーションの塗り、線、レイヤースタイルのグラデーションオーバレイに付属するグラデーションパラメータに適用するプリセットのバイナリを生成する。
実際に使用する際は、このバイナリをファイルとして保存し、Layer.applyPreset()で適用する。 `Property.setGradientValue() <../Property/index.html#property-setgradientvalue>`_ も参照のこと。

.. versionadded:: 0.5.0

RIFX.makePseudoEffectPreset()
-----------------------------

``makePseudoEffectPreset(config: Pseudo.Config): string;``

Pseudo Effectのプリセットのバイナリを生成する。
実際に使用する際は、このバイナリをファイルとして保存し、Layer.applyPreset()で適用する。 `Pseudo <../Pseudo/index.html>`_ も参照のこと。

.. versionadded:: 0.5.0
