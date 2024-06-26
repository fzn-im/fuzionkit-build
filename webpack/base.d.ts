export interface BuildProfile {
  name: string;
  mode: 'development' | 'production';
  outputPath: string;
  basePath: string;
  nodeModulesPath: string;
  resolveModules?: string[];
  sassIncludePaths?: Array<string>;
  srcPath: string;
  tsconfigPath?: string;
}

export function modules(buildProfile: BuildProfile): webpack.Configuration['modules'];
export function plugins(
  buildProfile: BuildProfile,
  plugins: webpack.Configuration['plugins'],
): webpack.Configuration['plugins'];
export function resolve(buildProfile: BuildProfile): webpack.Configuration['resolve'];
