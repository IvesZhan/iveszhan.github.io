# ZenSee Web

This directory is the root of the ZenSee Web project. It can be published directly as a GitHub Pages site and currently contains the legal pages, download pages, and public group share pages.

## Recommended setup

This directory is maintained from the unified `IvesZhan/zensee` repository.

The GitHub Actions sync workflow publishes this folder into the `zensee-web/` directory of the `IvesZhan/iveszhan.github.io` repository, so the public site is served from:

- `https://iveszhan.github.io/zensee-web/`

The former standalone `IvesZhan/zensee-web` repository is no longer required.

Additional ZenSee-owned Pages paths are stored under `github-pages/`:

- `github-pages/zensee/` publishes to `https://iveszhan.github.io/zensee/`
- `github-pages/wechat-sdk/` publishes to `https://iveszhan.github.io/wechat-sdk/`
- `github-pages/root-association-files/` contains reference copies for root-level association files that must be merged in the shared `IvesZhan/iveszhan.github.io` repository when they change

## Repository structure

- `privacy-policy/index.html`
- `terms-of-service/index.html`
- `support/index.html`
- `download/index.html`
- `download/en/index.html`
- `download/zh-hant/index.html`
- `download/ja/index.html`
- `group/index.html`
- `group/en/index.html`
- `group/zh-hant/index.html`
- `group/ja/index.html`
- `github-pages/zensee/index.html`
- `github-pages/zensee/dingtalk-login/index.html`
- `github-pages/zensee/dingtalk-auth/index.html`
- `github-pages/wechat-sdk/index.html`
- `github-pages/root-association-files/apple-app-site-association`
- `github-pages/root-association-files/.well-known/apple-app-site-association`
- `github-pages/root-association-files/.well-known/assetlinks.json`

## Asset conventions

Static images are managed under `assets/images/`:

- `assets/images/brand/`: brand icon and favicon
- `assets/images/screens/`: product screenshots used by homepage and download pages
- `assets/images/editorial/`: decorative and atmosphere images used by marketing sections

Keep new image files inside these folders instead of placing them in the project root or under individual page folders.

## Enable GitHub Pages

In the target repository on GitHub:

1. Open `Settings`
2. Open `Pages`
3. Under `Build and deployment`
4. Set `Source` to `Deploy from a branch`
5. Set branch to `main`
6. Set folder to `/(root)`
7. Click `Save`

## Final URL formats

Current production URLs:

- `https://<github-username>.github.io/zensee-web/privacy-policy/`
- `https://<github-username>.github.io/zensee-web/terms-of-service/`
- `https://<github-username>.github.io/zensee-web/support/`
- `https://<github-username>.github.io/zensee-web/download/`
- `https://<github-username>.github.io/zensee-web/download/en/`
- `https://<github-username>.github.io/zensee-web/download/zh-hant/`
- `https://<github-username>.github.io/zensee-web/download/ja/`
- `https://<github-username>.github.io/zensee-web/group/?id=<group-uuid>`
- `https://<github-username>.github.io/zensee-web/group/en/?id=<group-uuid>`
- `https://<github-username>.github.io/zensee-web/group/zh-hant/?id=<group-uuid>`
- `https://<github-username>.github.io/zensee-web/group/ja/?id=<group-uuid>`

ZenSee app-link and callback URLs:

- `https://<github-username>.github.io/zensee/`
- `https://<github-username>.github.io/zensee/dingtalk-login/`
- `https://<github-username>.github.io/zensee/dingtalk-auth/`
- `https://<github-username>.github.io/wechat-sdk/`

## Notes

- The web pages use relative links within `zensee-web/`.
- The public group page depends on shared Supabase RPC definitions maintained in `/Users/ives/Desktop/Program/ZenSee/Supabase/sql/group_public_share_hotfix.sql`.
- Do not push this folder to a standalone web repository. Push changes to the unified repository and let the sync workflow publish the static site.
- Do not manage the whole `IvesZhan/iveszhan.github.io` repository from this folder. It is an account-level Pages service shared by future projects.

## Universal Links

GitHub Pages can be used for Apple Universal Links, but the AASA file must be reachable from the domain root:

- `https://<domain>/.well-known/apple-app-site-association`
- or `https://<domain>/apple-app-site-association`

The root AASA and Android Asset Links files are shared account-level files. ZenSee reference copies are maintained in `github-pages/root-association-files/`, but the publish workflow does not overwrite the Pages repository root.

The AASA files in this folder are prepared for the current iOS app:

- Team ID: `L7U6Z557S6`
- Bundle ID: `com.yuzhan.zenseeapp`
- shared group path: `/zensee-web/group/*`
- WeChat SDK callback path: `/wechat-sdk/*`
