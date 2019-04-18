# MovableType CustomField Registerer
テストサーバーに配置されたMTの特定のブログに、連番の振られたカスタムフィールドを追加するスクリプト

`node.js`で`puppeteer`を使い、`Basic認証`と`MTのログイン`を通過し、任意のカスタムフィールドを追加します。

config.jsonをルートに作成し、
```json
{
  "basic_auth": {
    "username": "USERNAME",
    "password": "PASSWORD"
  },
  "mt_auth": {
    "username": "USERNAME",
    "password": "PASSWORD"
  },
  "login_url": "URL",
  "repeat_page_url": "URL",
  "result_page_url": "URL"
}

```
をそれぞれ入力し、`npm run app`で実行。

repeat_page_url: 任意のブログにおけるカスタムフィールド新規追加のURL  
result_page_url: 任意のURL。最後にスクリーンショットが取られ、`screenshot.png`として同階層に保存される。
