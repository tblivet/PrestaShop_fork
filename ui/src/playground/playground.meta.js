/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Shared runtime defaults for all playground stories — spread into every story's default export.
// NOTE: Do NOT put `tags` here. Storybook's CSF static indexer only reads literal properties in
// each story file and cannot follow import spreads. Tags must be declared directly in the story.
export const playgroundMeta = {
  parameters: {
    layout: 'fullscreen',
  },
};
