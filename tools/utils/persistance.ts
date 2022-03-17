import { promisify } from 'util';
import * as fs from 'fs';


export async function saveJson(json: any, path: string): Promise<void> {
  const writeFileAsync = promisify(fs.writeFile);
  await writeFileAsync(path, JSON.stringify(json, null, 4));
}