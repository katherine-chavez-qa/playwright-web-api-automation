import path from 'node:path';

// Session saved by the `setup` project and reused by the web projects.
export const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');
