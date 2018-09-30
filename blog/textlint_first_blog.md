textlint Getting  Started のメモ

## 前提

1. すべてのルールはプラグインになっており、textlintはそれらを読み込むようにして利用する
2. textlintはMarkdownやテキスト、HTMLをプラグインを利用してパースする
3. textlintはテキストのパターンを評価するためにASTとしてテキストを扱う
4. textlintはエラーや注意を表示する

## npm を使ってインストールして適当なルールを使ってみる

### npmとルールのインストール

```shell

$ mkdir textlint-test && cd textlint-test
$ npm init --yes
$ npm install -D textlint
$ npm install -D textlint-rule-no-todo
$ ./node_modules/.bin/textlint --rule no-todo file.md
```

### マークダウンをファイル（file.md）に保存

```markdown
# file.md

- [ ] textlintのブログを書く

`- [ ]` これはエラーにならない
```

### はじめてのチェック

```
$ npx textlint --rule no-todo file.md

/Users/zuckey/.ghq/github.com/zuckeyM-17/textlint-sandbox/file.md
  3:3  error  Found TODO: '- [ ] textlintのブログを書く'  no-todo

✖ 1 problem (1 error, 0 warnings)
```

## 設定ファイル

### `.textlintrc`を作成する

```shell
$ npx textlint --init
.textlintrc is created.

$ cat .textlintrc
{
  "filters": {},
  "rules": {
    "no-todo": true
  }
}%
```

先程、 `no-todo`をインストールしているので、initの時点で追加されている

### ルールの指定は必要ない

```
$ npx textlint file.md
```

### 設定ファイルの書き方

```JSON
{
  "rules": {
    "no-todo": true, // ルールを有効に
    "< name >": false, # ルールを無効に
    "< name >": { // ルールには細かいオプションがあるものもある
        "key": "value" // JSONのkey valueで表される
    },
    "< name >":  {
    	"severity": "warning" // error か warningルールの重要度を設定できる
    }
  }
}
```

ルールは作成できることができ、ルール名は以下のようになっている必要がある

- textlint-rule-< name >
- < name >
- @scope/textlint-rule-< name >
- @scope/< name >


## プリセットルール

プリセットルールはルールの集まりで、以下のようにして使う

### 集まりすべてを有効にする場合

```
{
  "rules": {
    "preset-example": true
  }
}
```

### もちろん各ルールで設定可能

```
{
  "rules": {
    "preset-example": {
        "foo": true // preset-exampleに含まれる、"text-lint-rulr-foo" はこのようにして指定する
    }
  }
}
```

## 実際にやってみる

### 連続する接続詞でwarning

#### ルールのインストール

```
$ npm install -D  textlint-rule-no-start-duplicated-conjunction
```

#### 設定を書く

```
$ cat .textlintrc
{
  "filters": {},
  "rules": {
    "no-todo": true,
    "no-start-duplicated-conjunction": { // text-lint-< name > のnameをkeyにする
      "interval": 2 # 同じ接続詞を使うには、 2文以上間に挟まないといけない
    }
  }
}
```

#### 以下のファイルを保存

```
# file.md

- [ ] textlintのブログを書く

`- [ ]` これはエラーにならない

## 接続詞

僕は、眠い。
しかし、ブログを書かないといけない。
なぜなら週1でブログを書くと決めているからだ。
しかし、眠い。

```

#### 動かしてみる

```
$ npx textlint file.md

/Users/zuckey/.ghq/github.com/zuckeyM-17/textlint-sandbox/file.md
   3:3  error  Found TODO: '- [ ] textlintのブログを書く'  no-todo
  11:1  error  Don't repeat "しかし" in 2 phrases          no-start-duplicated-conjunction

✖ 2 problems (2 errors, 0 warnings)
```

### 他の設定

```
$ cat .textlintrc
{
  "filters": {},
  "rules": {
    "no-todo": true,
    "no-start-duplicated-conjunction": {
      "interval": 2,
      "severity": "warning" # severityをwarningにしてみる
    }
  }
}
```

```
$ npx textlint file.md

/Users/zuckey/.ghq/github.com/zuckeyM-17/textlint-sandbox/file.md
   3:3  error    Found TODO: '- [ ] textlintのブログを書く'  no-todo
  12:1  warning  Don't repeat "しかし" in 2 phrases          no-start-duplicated-conjunction

✖ 2 problems (1 error, 1 warning)
```

## まとめ

- 簡単にtextlintににゅうもんした
- 次はルールを作成したい
