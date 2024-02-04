# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
   PRs should document their user-visible changes (if any) in the
   Unreleased section, uncommenting the header as necessary.
-->

## Unreleased

- Add a `getChildren` API as a more specific method similar to `iterateOverAst` that only gets the direct children of a node.
- Add a `getNodesAtLocation` API to get the nodes whose ranges contain a given location.

## [0.1.0] - 2017-07-18

- Added ranges to AST nodes, which specify offsets into the source code for the
  start and end of AST.
- Added the `iterateOverAst` method, which returns an iterable over every
  node in an AST.
