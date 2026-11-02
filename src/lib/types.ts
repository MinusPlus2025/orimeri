export interface Taste { entityId: string; name: string; type: string; query: string; image?: string | null; enabled?: boolean }
export interface Area { id: string; name: string; city: string; lat: number; lon: number }
export interface IntentPlan { summary: string; categories: string[]; avoid: string[]; unknowns: string[]; locationMismatch: boolean }
export interface Evidence { label: string; detail: string; source: 'Qloo' | 'Geometry' | 'Request' }
export interface Place { checks?: {categories:string[]; excludedCategories:string[]; radiusM:number; origin:string}; revision?: {questions:string[];radiusM:number}; language?: 'en'|'zh'|'ja'; interpretation?: string; id: string; name: string; address: string | null; category: string; lat: number; lon: number; distanceM: number; image: string | null; website: string | null; affinity: number | null; evidence: Evidence[]; unknowns: string[] }
export interface Investigation { id: string; at: string; input: string; taste: Taste[]; area: Area; radiusM: number; plan: IntentPlan; places: Place[]; steps: { label: string; detail: string }[]; notices: string[]; live: true }
export interface DiscoverInput { taste: Taste[]; moment: string; areaId: string; radiusM: number; excludeIds: string[]; locale?: 'en'|'zh'|'ja'; challenge?: { targetId: string; text: string; condition?: string; previousQuestions?: string[] } }
