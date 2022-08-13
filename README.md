# Slack direct message Archiver

## 準備

### 1. Slackワークスペースにダウンロード用Appを追加

OAuth & PermissionsのScopesに以下を追加。User Token Scopes、Bot Token Scopes共に（？）

- channels:history
- files:read
- groups:history
- im:history
- mpim:history

OAuth Tokens for Your Workspaceを作成

`xoxp-9576956967-9576956969-9944867266081-95569daf0ec678878a02a77a2f04346f` のうようなもの

### 2. ダイレクトメッセージのURLを取得

コピー → リンクをコピー

`https://ey-office.slack.com/archives/DBBPT2AXX` のうようなもの

## 取得

.envファイルにチャネルIDとOAuth Tokenを書き

```
CHANNEL_ID=DBBPT2AXX
USER_OAUTH_TOKEN=xoxp-9576956967-9576956969-9944867266081-95569daf0ec678878a02a77a2f04346f
```

実行

```
$ npm start
$ npm run files
```

## 参考資料

- https://qiita.com/reiya018/items/1942c00c7e792cbff0f0