---
date: 2026-04-27
area: tooling
symptom: pip install fails with "failed-wheel-build-for-install" on pydantic-core under Python 3.14
---

# Pinned pydantic-core wheel build fails on Python 3.14

## Symptom

```
pip install -r requirements.txt
...
error: failed-wheel-build-for-install
× Failed to build installable wheels for some pyproject.toml based projects
╰─> pydantic-core
```

Triggered by an exact pin like `pydantic==2.9.2` against a Python that doesn't yet have a precompiled wheel on PyPI for that version of pydantic-core.

Python 3.14 is too new for many older wheels. Upstream maintainers haven't always cut new releases against it yet, and the older releases were built before 3.14's ABI was final.

## Fix

Loosen the pin to a range so pip can resolve to a version with a 3.14 wheel:

```diff
-pydantic==2.9.2
+pydantic>=2.9
```

Same pattern for `fastapi` and `uvicorn` if they have transitive pydantic-core constraints.

The cc-lab samples now use range pins (`>=`) deliberately — they need to install on Python 3.11 through whatever's current.

## What to look for

- Hard `==` pins on packages with C extensions (pydantic-core, numpy, cryptography, …)
- A Python version newer than the package's last release
- pip output mentioning a Rust toolchain (cargo) — pydantic-core's wheel is built from Rust source when no prebuilt wheel matches

## Counter-example: when to keep `==` pins

For library/SDK projects where reproducibility is more valuable than forward-compat, exact pins are right. For workshop sample apps that participants will install on whatever Python they have, range pins serve them better.
