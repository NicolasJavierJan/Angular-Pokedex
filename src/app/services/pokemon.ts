import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  private cachedPokemonList: any[] | null = null;

  constructor(private http: HttpClient) { }

  nameHasHyphen = ['nidoran-f', 'nidoran-m', 'mr-mime', 'ho-oh', 'mime-jr', 'type-null', 'jangmo-o', 'hakamo-o',
      'kommo-o', 'tapu-bulu', 'tapu-koko', 'tapu-lele', 'tapu-fini', 'mr-rime', 'great-tusk', 'scream-tail', 'brute-bonnet',
      'flutter-mane', 'slither-wing', 'sandy-shocks', 'iron-treads', 'iron-bundle', 'iron-hands', 'iron-jugulis', 'iron-moth',
      'iron-thorns', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'roaring-moon', 'iron-valiant', 'iron-leaves', 'walking-wake',
      'gouging-fire', 'raging-bolt', 'iron-boulder', 'iron-crown' 
  ];

  nameHasForm = ['deoxys-normal', 'wormadam-plant', 'giratina-altered', 'shaymin-land', 'basculin-red-striped', 
      'darmanitan-standard', 'tornadus-incarnate', 'thundurus-incarnate', 'landorus-incarnate', 'keldeo-ordinary', 'meloetta-aria',
      'meowstic-male', 'aegislash-shield', 'pumpkaboo-average', 'gourgeist-average', 'zygarde-50', 'oricorio-baile', 'lycanroc-midday',
      'wishiwashi-solo', 'minior-red-meteor', 'mimikyu-disguised', 'toxtricity-amped', 'eiscue-ice', 'indeedee-male', 'morpeko-full-belly',
      'urshifu-single-strike', 'basculegion-male', 'enamorus-incarnate', 'oinkologne-male', 'maushold-family-of-four', 'squawkabilly-green-plumage',
      'palafin-zero', 'tatsugiri-curly', 'dudunsparce-two-segment' 
  ];

  private loadingList = false;

  async getPokemonList(limit: number): Promise<any[]> {
  if (this.cachedPokemonList) {
    return this.cachedPokemonList;
  }

  if (this.loadingList) {
    return new Promise(resolve =>
      setTimeout(() => resolve(this.getPokemonList(limit)), 100)
    );
  }

  this.loadingList = true;

  try {
    const url = `${this.baseUrl}?limit=${limit}`;
    const response = await firstValueFrom(this.http.get<{ results: any[] }>(url));
    const all = response.results;

    const hyphenated = all.filter((p: any) => p.name.includes('-'));

    for (const p of hyphenated) {
      try {
        const speciesName = this.resolveSpeciesName(p.name);
        const species = await firstValueFrom(
          this.http.get<any>(`${this.baseUrl}-species/${speciesName}`)
        );
        const englishName = species.names.find((n: any) => n.language.name === 'en');
        const displayName = englishName ? englishName.name : species.name;

        const idx = all.findIndex((x: any) => x.name === p.name);
        if (idx !== -1) {
          all[idx] = { ...all[idx], displayName };
        }
      } catch (e) {
        console.warn('Failed to fetch display name for', p.name);
      }
    }

    this.cachedPokemonList = all;
    return all;
  } finally {
    this.loadingList = false;
  }
}


  async getFullPokemonDetail(name: string): Promise<any> {
    const pokemon = await firstValueFrom(
      this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${name}`)
    );

    const cached = this.cachedPokemonList?.find(p => p.name === name);
    const displayNameFromCache = cached?.displayName;

    const speciesName = this.resolveSpeciesName(name);
    const species = await firstValueFrom(
      this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${speciesName}`)
    );

    const englishNameFromSpecies = species.names.find(
      (n: any) => n.language.name === 'en'
    )?.name;

    return {
      ...pokemon,
      species,
      displayName: displayNameFromCache ?? englishNameFromSpecies ?? name
    };
  }


  getPokemonSpecies(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  }

  getEvolutionChainByUrl(url: string) {
    return this.http.get(url);
  }

  resolveSpeciesName(name: string): string {
    if (this.nameHasHyphen.includes(name)) return name;
    if (this.nameHasForm.includes(name)) return name.split('-')[0];
    return name;
  }

  getDisplayName(name: string): string {
    // Map hyphenated names to proper display names, e.g.
    const map: Record<string, string> = {
      'mr-mime': 'Mr. Mime',
      'nidoran-f': 'Nidoran ♀',
      // Add others here, or use cached names
    };
    return map[name] || name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
