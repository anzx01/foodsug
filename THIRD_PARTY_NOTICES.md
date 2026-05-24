# Third-Party Notices

This project uses open-source npm packages listed in `package.json` and locked
in `pnpm-lock.yaml`.

## Dependency License Review

Before publishing a release, run:

```bash
pnpm install
pnpm licenses list --prod
```

Keep the generated output with release artifacts if your distribution process
requires a complete dependency notice bundle.

## Notable Runtime Providers

- Alibaba Cloud DashScope/Qwen may be used by the backend when
  `DASHSCOPE_API_KEY` is configured.
- The OpenAI JavaScript SDK is used only as an OpenAI-compatible client library.

## Vendor Documentation

Do not copy full vendor documentation into this repository. Link to official
provider documentation from project notes instead.
