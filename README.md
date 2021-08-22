# henken.club/backend (prototype)

henken.club の**プロトタイプ**バックエンド．

## Docker Image

### 開発版

`develop`ブランチでの push ごとに更新されるので sha256 ダイジェストの指定推奨．

```bash
docker pull ghcr.io/henken-club/prototype-backend:develop
```

## Development

```
yarn install
```

環境変数の例は`.env.example`に置いてあるので[direnv](https://github.com/direnv/direnv)などで読み込むこと．

各種`docker-compose.*.yml`の詳細は以下の通り．

- `docker-compose.yml`
- `tests/docker-compose.test.yml`
  - テスト用の MySQL や Neo4j などを立ち上げる．

## GitHub Actions

### [DevOps](https://github.com/henken-club/prototype-backend/blob/develop/.github/workflows/devops.yml)

静的解析(ESLint, Prettier など)，型チェック，テストなど．

以下の条件で走る．

- Pull Request
- `develop` ブランチでの push

### [Push](https://github.com/henken-club/prototype-backend/blob/develop/.github/workflows/push.yml)

ghcr.io への push．

以下の条件で走る．

- `develop` ブランチでの push
- `release` ブランチでの push
