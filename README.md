# これはなに？

社内のチームのスプレッドシートの施策リストから、今週議論されたものをフィルターしてSlackにぽいっと投げるだけの簡単な子

## fork元

[https://github.com/gatchan0807/gas-template-by-clasp-and-typescript](https://github.com/gatchan0807/gas-template-by-clasp-and-typescript)

# 使い方

（前提としてNode.jsやyarnやclaspのグローバルインストールは完了済みのもので）

1. `git clone` する
2. `yarn` する（ `yarn install` を実行する）
3. https://script.google.com で新規スクリプトプロジェクトを作成する
4. `appsscript.json` の `scriptId` を 4 で作成したプロジェクトのプロジェクトIDに書き換える
5. テストとして `clasp push` を実行する

# やってること

- VSCodeで補完が効くように `@types/google-apps-script` をインストールしている
- yarn initをやってる
- clasp create をやってる