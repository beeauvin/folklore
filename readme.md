<p align="center">
  <img src="./.media/folklore-image-cropped.png" width="100" alt="folklore logo" />
</p>

<p align="center">a re-telling of <a href="https://folktale.origamitower.com" target="_blank">folktale</a></p>
<p align="center">early stages, use at your own peril</p>

<p align="center">
  <a href="https://www.npmjs.com/package/folklore" target="_blank"><img src="https://img.shields.io/npm/l/folklore.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/package/folklore" target="_blank"><img src="https://img.shields.io/npm/dm/folklore.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/beeauvin/folklore/actions/workflows/continuous-integration.yml" target="_blank">
    <img src="https://github.com/beeauvin/folklore/actions/workflows/continuous-integration.yml/badge.svg" alt="continuous integration" />
  </a>
  <a href="https://codecov.io/gh/beeauvin/folklore" >
    <img src="https://codecov.io/gh/beeauvin/folklore/graph/badge.svg?token=19O67TDUG0"/>
  </a>
</p>

# folklore

a re-telling of [folktale](https://folktale.origamitower.com)

in the early stages, things will change, use at your own `peril`

Currently `Maybe` and `Result` are implemented and reasonably stable. Still, minor version bumps may break things. Use
`~` in your `package.json` to avoid breaking changes.

There are some differences from Folktale's API. As an example, hasInstance is a static method on both in pascal case:
`HasInstance`. Check the source (or intellisense in your editor). See
[#13: A Retelling, not a reimplementation](https://github.com/cassiecascade/folklore/issues/13) for more information
about this.

## License

folklore is provided under the [Mozilla Public License 2.0](https://mozilla.org/MPL/2.0/).

A copy of the MPLv2 is included [license.md](/license.md) file for convenience.
