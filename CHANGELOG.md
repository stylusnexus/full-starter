# Changelog

## [1.1.0](https://github.com/stylusnexus/full-starter/compare/v1.0.0...v1.1.0) (2026-10-04)


### Features

* **agents:** add qa-explorer, an exploratory browser-testing agent ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
* **docs:** add get-started steps, who-it-is-for and what-it-is-not-for sections, and an About This Template section for agents ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
* **e2e:** add app-contract.ts so the smoke tests fit your app (a null entry skips its test with the reason) ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
* **guidance:** add shared-primitives guidance plus evidence, blast-radius, and stop-after-two-failed-fixes rules ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
* **scripts:** add check-docs-sync.sh to keep README and site counts in step with the repo ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
* **setup:** ask one plain-language question about sign-in and fill the app contract from the code ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))


### Bug Fixes

* **e2e:** treat a null loginPath as no sign-in, and start a dev server only when BASE_URL is unset ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
* **verify:** skip smoke tests when there is no app, run the security scan by default, and fail if no check ran ([e6c7be9](https://github.com/stylusnexus/full-starter/commit/e6c7be9bbf94eb3b19362e3200b5444e275e52d5))
