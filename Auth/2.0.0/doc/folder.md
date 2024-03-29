# フォルダ構成

- client/ : client(index.html)関係のソース
  - commonConfig.js : client/server共通config
  - clientConfig.js : client特有のconfig
  - proto.js : class Auth全体のソース
  - test.html : client関係のテスト用html
  - xxx.js : class Authの各メソッドのソース
- server/ : server(server.gs)関係のソース
  - serverConfig.js : server特有のconfig
- doc/ : readme.mdの各記事のソース集
  - proto.md : readme.mdのプロトタイプ
  - xxx.md : readme.mdに埋め込む各記事のソース
- build.sh : client/server全体のビルダ
- core.js : class Authのソース
- index.html : 
- server.gs : サーバ側Authのソース
- readme.md : doc配下を統合した、client/server全体の仕様書
