# textlint のルール作成 はじめました

<a href="#prev_entry"></a>
前回は[こちら](https://blog.zuckey17.org/entry/2018/09/30/233850)でtextlintを簡単に触ってみました。

公式サイトの[Creating Rules](https://textlint.github.io/docs/rule.html)を参考にします。


### 【注意】
説明の都合上、`AST`などの単語が出てきておりますが、僕自身あまり深く理解しておりません。
細かな理解が誤っていれば教えていただきたいです🙇‍♂️

## `no-todo`を作る

[前回](#prev_entry)も利用した`no-todo`というルールを自分で作成してみます。

`no-todo`というルールは

- `- [ ]`がリストのすべての項目に含まれないこと
- `todo:`がプレーンなテキストの一部に含まれないこと

を確かめるためのLintルールでした。

### 準備

`create-textlint-rule`のインストールとプロジェクトの作成

```sh
// 公式ではグローバルにインストールしていますが、ここではローカルにインストールしています。
$ npm install create-textlint-rule

// create-textlint-rule <ルール名> を実行すると、
// "textlint-rule-<ルール名>"というプロジェクトディレクトリが作成されます。
$ npx create-textlint-rule no-todo

$ ls textlint-rule-no-todo

-rw-r--r--    1 zuckey  staff     598 10  7 23:12 README.md
-rw-r--r--    1 zuckey  staff  179575 10  7 23:12 package-lock.json
drwxr-xr-x    4 zuckey  staff     128 10  7 23:12 lib
drwxr-xr-x  392 zuckey  staff   12544 10  7 23:12 node_modules
-rw-r--r--    1 zuckey  staff     471 10  7 23:12 package.json
drwxr-xr-x    3 zuckey  staff      96 10  7 23:12 test
drwxr-xr-x    3 zuckey  staff      96 10  7 23:12 src
```

### コードを書く

先程作成した、プロジェクト直下`src/`の中にコードを記載していきます。

#### Stringノードのチェック

```javascript
/**
 * @param {RuleContext} context
 */
export default function(context) {
    const helper = new RuleHelper(context);
    const { Syntax, getSource, RuleError, report } = context;
    // さまざまなプロパティが定義されているので事前に受け取っておく
    return {
        // [Syntax.Str]は ASTで分解された文全体の1ノードがStr(ing)のものにたいして
        // ルールを設定したいときに返却するオブジェクトのプロパティとして定義します。
        // ここの中で report メソッドを呼ぶと、エラーの表示が可能です。
        [Syntax.Str](node) { 
            const text = getSource(node); // ノードから文字列だけを取り出しています。

            const match = text.match(/todo:/i);
            // "todo:"という文字列がないかどうかを、正規表現で大文字小文字関係なくチェックします。
            // 存在すれば、↓ のif文の中でreportを呼びます。
            if (match) {
                report(
                    node,
                    new RuleError(`Found TODO: '${text}'`, {
                        index: match.index
                    })
                );
            }
        },
    };
}
```

#### ListItem ノードのチェック

```javascript
/**
 * @param {RuleContext} context
 */
export default function(context) {
    const { Syntax, getSource, RuleError, report } = context;
    return {
        ...,
        // [Syntax.ListItem]は ASTで分解されたmarkdownの文書全体の1ノードがListItem(- )のものにたいして
        // ルールを設定したいときに返却するオブジェクトのプロパティとして定義します。
        [Syntax.ListItem](node) {
            const text = context.getSource(node); // ノードから文字列だけを取り出しています。
            const match = text.match(/\[\s+\]\s/i);
            // "[ ]"という文字列がないかどうかを、正規表現でチェックします。
            // 存在すれば、↓ のif文の中でreportを呼びます。
            if (match) {
                report(
                    node,
                    new context.RuleError(`Found TODO: '${text}'`, {
                        index: match.index
                    })
                );
            }
        }
    };
}
```

### コードのビルド

```sh
$ npm run build
```

と実行すると、トランスパイルされ、`lib/`以下にコードが書き込まれます。

### 実行

例のによって以下のファイルをチェックします。

```markdown
# file.md

- [ ] textlintのブログを書く

`- [ ]` これはエラーにならない

# 接続詞

僕は、眠い。
しかし、ブログを書かないと行けない。
僕は2あれ。
しかし、眠い。

```

```sh
$ npx textlint --rulesdir lib/ file.md -f pretty-error
no-todo: Found TODO: '- [ ] textlintのブログを書く'
/Users/zuckey/.ghq/github.com/zuckeyM-17/textlint-sandbox/file.md:3:3
         v
    2.
    3. - [ ] textlintのブログを書く
    4.
         ^
```


いい感じですね。

## まとめ と 補足

- 
