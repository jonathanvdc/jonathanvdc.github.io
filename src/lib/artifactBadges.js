export const artifactBadges = {
  available: {
    src: '/images/artifact-evaluation-badges/artifacts_available_v1_1.svg',
    alt: 'Artifact Available'
  },
  reusable: {
    src: '/images/artifact-evaluation-badges/artifacts_evaluated_reusable_v1_1.svg',
    alt: 'Artifact Reusable'
  },
  'results-reproduced': {
    src: '/images/artifact-evaluation-badges/results_reproduced_v1_1.svg',
    alt: 'Results Reproduced'
  }
};

export function badgesFromKeys(keys = []) {
  return keys.map((key) => artifactBadges[key]).filter(Boolean);
}
