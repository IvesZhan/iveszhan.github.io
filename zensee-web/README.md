# ZenSee Web

This directory is the root of the ZenSee Web project. It can be published directly as a GitHub Pages site and currently contains the legal pages, download pages, and public group share pages.

## Recommended setup

This directory is maintained from the unified `IvesZhan/zensee` repository.

The GitHub Actions sync workflow publishes this folder into the `zensee-web/` directory of the `IvesZhan/iveszhan.github.io` repository, so the public site is served from:

- `https://iveszhan.github.io/zensee-web/`

The former standalone `IvesZhan/zensee-web` repository is no longer required.

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
- `wechat-sdk/index.html`
- `.well-known/apple-app-site-association`
- `apple-app-site-association`
- `.nojekyll`

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

If this folder is ever published at the user-site root instead:

- `https://<github-username>.github.io/privacy-policy/`
- `https://<github-username>.github.io/terms-of-service/`
- `https://<github-username>.github.io/support/`
- `https://<github-username>.github.io/download/`
- `https://<github-username>.github.io/download/en/`
- `https://<github-username>.github.io/download/zh-hant/`
- `https://<github-username>.github.io/download/ja/`
- `https://<github-username>.github.io/group/?id=<group-uuid>`
- `https://<github-username>.github.io/group/en/?id=<group-uuid>`
- `https://<github-username>.github.io/group/zh-hant/?id=<group-uuid>`
- `https://<github-username>.github.io/group/ja/?id=<group-uuid>`

## Notes

- `.nojekyll` is included so the static files are served directly.
- The pages use relative links, so both repository URL styles above will work.
- The public group page depends on shared Supabase RPC definitions maintained in `/Users/ives/Desktop/Program/ZenSee/Supabase/sql/group_public_share_hotfix.sql`.
- Do not push this folder to a standalone web repository. Push changes to the unified repository and let the sync workflow publish the static site.

## Universal Links

GitHub Pages can be used for Apple Universal Links, but the AASA file must be reachable from the domain root:

- `https://<domain>/.well-known/apple-app-site-association`
- or `https://<domain>/apple-app-site-association`

The root AASA file is maintained in the `iveszhan.github.io/` directory. It includes the `/zensee-web/group/*` path used by the static group share pages.

The AASA files in this folder are prepared for the current iOS app:

- Team ID: `L7U6Z557S6`
- Bundle ID: `com.yuzhan.zenseeapp`
- shared group path: `/zensee-web/group/*`
- WeChat SDK callback path: `/wechat-sdk/*`
