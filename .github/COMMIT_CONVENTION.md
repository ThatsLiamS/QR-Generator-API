# Git Commit Message Convention

This convention is based on the Conventional Commits specification, tailored for the backend of a QR code generation service.

---

## TL;DR:

Messages must be matched by the following regex:

```
/^(revert: )?(feat|fix|refactor|perf|test|style|workflow|chore|docs|build|ci)((api|deps|db|generation|auth|build))?: .{1,72}/
```

---

## Full Message Format

A commit message consists of a **header**, **body**, and **footer**. The header must include a **type** and an optional **scope** and **subject**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Header

The **header** is mandatory.

#### Type (Mandatory)

The type defines the kind of change being made.

| Type | Description | Changelog Impact |
| :--- | :--- | :--- |
| **feat** | A new feature for the application. | ✅ Yes |
| **fix** | A bug fix. | ✅ Yes |
| **perf** | A code change that improves performance. | ✅ Yes |
| **refactor** | A code change that neither fixes a bug nor adds a feature (e.g., restructuring existing code). | ❌ No |
| **test** | Adding missing tests or correcting existing tests. | ❌ No |
| **style** | Changes that do not affect the meaning of the code (e.g., whitespace, formatting, semicolons). | ❌ No |
| **chore** | Routine tasks that don't modify source code or tests (e.g., updating npm dependencies, changing build config). | ❌ No |
| **docs** | Documentation only changes (e.g., to the README, API docs, or code comments). | ❌ No |
| **build** | Changes to the build system or external dependencies (e.g., changes to npm scripts, Dockerfile). | ❌ No |
| **ci** | Changes to our Continuous Integration configuration files and scripts (e.g., GitHub Actions, Jenkins). | ❌ No |

#### Scope (Optional, but Recommended)

The scope provides contextual information, usually a module or component name, surrounded by parentheses.

| Scope | Description |
| :--- | :--- |
| **api** | Changes to public endpoints, request/response formats, or routing. |
| **deps** | Adding, upgrading, or removing external dependencies. |
| **db** | Changes to the database schema, migrations, or ORM configuration. |
| **generation** | Changes to the core QR code logic (encoding, image format, ECC level). |
| **auth** | Changes to authentication, authorization, tokens, or permissions. |

**Example:** `feat(api): add parameter for color customization`

#### Subject (Mandatory)

The subject contains a succinct, maximum **72-character** description of the change:

  * Use the **imperative, present tense**: "change" not "changed."
  * Do not capitalize the first letter.
  * Do not add a dot (`.`) at the end.

### Body

The body is optional but strongly recommended for `feat` and `fix` commits.

  * Use the **imperative, present tense**: "change" not "changed."
  * It should include the motivation for the change and contrast it with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is used to reference GitHub issues that this commit **Closes**.

* **Breaking Changes** must start with the phrase `BREAKING CHANGE:` (with a space or two newlines). The rest of the message describes the breaking change, migration path, and rationale.

**Example:**

```
BREAKING CHANGE: The /api/v1/generate endpoint no longer accepts the 'size' parameter. Use 'width' and 'height' instead.
```

* **Issue Closing** references should use standard GitHub keywords (e.g., `Closes #123`, `Fixes #456`).

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it must say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.
