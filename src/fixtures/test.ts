import { mergeTests } from '@playwright/test';
import { test as a11yTest } from './a11y';
import { test as apiTest } from './api';
import { test as pageTest } from './pages';

// Single entry point for every spec. Fixtures are lazy: a test only pays for
// what it asks for, so API tests never launch a browser and vice versa.
export const test = mergeTests(pageTest, apiTest, a11yTest);

export { expect } from '@playwright/test';
