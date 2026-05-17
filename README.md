# IvesZhan GitHub Pages

This repository is the account-level GitHub Pages service for `https://iveszhan.github.io/`.

It is a shared static hosting target for public project pages, app links, OAuth/callback pages, and compatibility redirects. It should not be treated as the source repository for any single product.

## Repository role

- Keep this repository small and publish-focused.
- Keep product source code in each product's own repository.
- Publish each product under one top-level project namespace.
- Keep account-level association files at the repository root.
- Avoid manually editing generated project folders except for emergency production fixes.

## Current structure

```text
/
  index.html                         Shared project index
  .nojekyll                          GitHub Pages config
  apple-app-site-association         Shared Apple Universal Links file
  .well-known/
    apple-app-site-association       Shared Apple Universal Links file
    assetlinks.json                  Shared Android App Links file

  zensee/                            ZenSee project namespace
    web/                             ZenSee website, legal pages, downloads, group pages
    dingtalk-login/                  ZenSee DingTalk login page
    dingtalk-auth/                   ZenSee DingTalk auth callback
    wechat-sdk/                      ZenSee WeChat SDK callback

  zensee-web/                        Legacy ZenSee compatibility redirects
```

## Project namespace rule

Every product should own exactly one top-level folder in this repository.

Examples:

```text
/zensee/...
/another-project/...
/some-tool/...
```

Do not add new project-owned folders at the repository root unless they are the project namespace itself. For example, a project's website, callbacks, legal pages, and share pages should all live under that project's namespace:

```text
/project-slug/web/
/project-slug/auth/
/project-slug/callback/
/project-slug/share/
```

## Recommended publish flow

1. Keep the real source files in the product repository.
2. Build or prepare the static output in that product repository.
3. Use GitHub Actions to publish only that product's public files into this repository.
4. Publish into the product namespace, such as `/zensee/web/`.
5. Preserve compatibility paths when already released apps or external links depend on old URLs.

For ZenSee, the source of truth is:

```text
IvesZhan/zensee
```

Its workflow publishes:

```text
ZenSee-Web/                     -> /zensee/web/
ZenSee-Web/github-pages/zensee/ -> /zensee/
```

## Root association files

The following files are shared by all projects on this domain:

```text
/apple-app-site-association
/.well-known/apple-app-site-association
/.well-known/assetlinks.json
```

These files are account-level resources. When a project needs Universal Links or App Links, merge its paths into the shared files carefully. Do not replace the whole file with a single project's config unless this domain is dedicated only to that project.

Current ZenSee paths include:

```text
/zensee
/zensee/
/zensee/*
/zensee-web/group/*
```

`/zensee-web/group/*` is kept for old ZenSee iOS group-share Universal Links.

## Legacy compatibility

`/zensee-web/` is no longer the primary ZenSee project namespace. It remains only as a compatibility layer for already released ZenSee app versions and previously shared links.

Do not remove it until old app versions are no longer a meaningful share of active users.

Removing `/zensee-web/` would affect:

- old ZenSee homepage/share fallback links
- old privacy policy links
- old terms of service links
- old support links
- old download links
- old public group share links, including links with `?id=<group-id>`
- old iOS Universal Link group-share handling through `/zensee-web/group/*`

It would not affect:

- `/zensee/dingtalk-login/`
- `/zensee/dingtalk-auth/`
- `/zensee/wechat-sdk/`
- `/zensee/`
- current `/zensee/web/...` pages

## Adding a new web project

Use this checklist:

1. Choose a stable lowercase project slug.
2. Create a top-level folder using that slug.
3. Put all public pages for the project under that folder.
4. Keep source code and build logic in the product repository, not here.
5. Add only required root association paths if the project needs Universal Links or App Links.
6. Document ownership and compatibility requirements in this README.

Preferred layout:

```text
/project-slug/web/
/project-slug/callback/
/project-slug/share/
```

Avoid:

```text
/project-slug-web/
/project-slug-callback/
/project-slug-share/
```

The second style scatters one product across multiple root folders and makes future maintenance harder.
