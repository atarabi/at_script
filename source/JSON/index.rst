====
JSON
====

JSON.stringify()
----------------

``stringify(value: any, replacer?: (string | number)[] | ((key: string, value: any) => any), space?: number | string): string;``

オブジェクト、値をJSON文字列にする。中身はjson2.js。

.. code-block:: typescript

    const dataStr = Atarabi.JSON.stringify({index: 1, time: 2.0});

JSON.parse()
------------

``parse(text: string, reviver?: (key: string, value: any) => any): any;``

JSON文字列をオブジェクト、値に変換する。中身はjson2.js。

.. code-block:: typescript

    const data = Atarabi.JSON.parse('{"index":1,"time":2}');

JSON.isValid()
--------------

``isValid(text: string): boolean;``

文字列が有効なJSON文字列か確かめる。C++側で、 `JSON for Modern C++ <https://github.com/nlohmann/json>`_ というライブラリを用いてチェックしている。

.. code-block:: typescript

    const isJSON = Atarabi.JSON.isValid('invalid json');

JSON.isValidFile()
------------------

``isValidFile(file: File): boolean;``

ファイルが有効なJSONファイルか確かめる。C++側で、 `JSON for Modern C++ <https://github.com/nlohmann/json>`_ というライブラリを用いてチェックしている。

.. code-block:: typescript

    const file = new File('test.json');
    const isJSONFile = Atarabi.JSON.isValidFile(file);

JSON.parseFast()
----------------

``parseFast(text: string): any;``

JSON.isValid()で有効なJSON文字列かを確かめた後、eval()を用いて、オブジェクト、値に変換する。ExtendScript実行環境下だと、特に複雑なJSON文字列の場合、処理に時間が掛かることがある。そこで、C++側でチェックした後にeval()を用いることで、高速化を図っている。

.. code-block:: typescript

    const data = Atarabi.JSON.parseFast('{"very":true,"complicated":true}');