import { MINERALS, NOMBRES } from '../data/minerals'

export async function getMinerales() {
 
  await new Promise((r) => setTimeout(r, 300))
  return { minerales: MINERALS, nombres: NOMBRES }
}