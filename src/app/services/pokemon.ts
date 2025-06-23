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

  async getPokemonList(limit: number): Promise<any> {
    if (this.cachedPokemonList) {
      return of({ results: this.cachedPokemonList });
    }

    const url = `${this.baseUrl}?limit=${limit}`;
    const response = await firstValueFrom(this.http.get<any>(url));
    const all = response.results;
    
    const hyphenated = all.filter((p: any) => p.name.includes('-'));

    const nameHasHyphen = ['nidoran-f', 'nidoran-m', 'mr-mime', 'ho-oh', 'mime-jr', 'type-null', 'jangmo-o', 'hakamo-o',
      'kommo-o', 'tapu-bulu', 'tapu-koko', 'tapu-lele', 'tapu-fini', 'mr-rime', 'great-tusk', 'scream-tail', 'brute-bonnet',
      'flutter-mane', 'slither-wing', 'sandy-shocks', 'iron-treads', 'iron-bundle', 'iron-hands', 'iron-jugulis', 'iron-moth',
      'iron-thorns', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'roaring-moon', 'iron-valiant', 'iron-leaves', 'walking-wake',
      'gouging-fire', 'raging-bolt', 'iron-boulder', 'iron-crown' 
    ];

    const nameHasForm = ['deoxys-normal', 'wormadam-plant', 'giratina-altered', 'shaymin-land', 'basculin-red-striped', 
      'darmanitan-standard', 'tornadus-incarnate', 'thundurus-incarnate', 'landorus-incarnate', 'keldeo-ordinary', 'meloetta-aria',
      'meowstic-male', 'aegislash-shield', 'pumpkaboo-average', 'gourgeist-average', 'zygarde-50', 'oricorio-baile', 'lycanroc-midday',
      'wishiwashi-solo', 'minior-red-meteor', 'mimikyu-disguised', 'toxtricity-amped', 'eiscue-ice', 'indeedee-male', 'morpeko-full-belly',
      'urshifu-single-strike', 'basculegion-male', 'enamorus-incarnate', 'oinkologne-male', 'maushold-family-of-four', 'squawkabilly-green-plumage',
      'palafin-zero', 'tatsugiri-curly', 'dudunsparce-two-segment' 
    ];

    for (const p of hyphenated) {
      try {
        const speciesName = nameHasHyphen.includes(p.name) // If nameHasHyphen then search with hyphen (otherwise it will fail)
          ? p.name
          : nameHasForm.includes(p.name) // else, name is a form? If yes, search only the Species name.
          ? p.name.split('-')[0]
          : p.name // Shouldn't reach here.
        
        const species = await firstValueFrom(
          this.http.get<any>(`${this.baseUrl}-species/${speciesName}`)
        );
        const englishName = species.names.find((n: any) => n.language.name === 'en');
        const displayName = englishName ? englishName.name : species.name;

        const idx = all.findIndex((x : any) => x.name === p.name);
        if (idx !== -1){
          all[idx] = {...all[idx], displayName};
        }
      } catch (e){
        console.warn('Failed to fetch a display name for ', p.name);
      }
    }

    this.cachedPokemonList = all;
    return { results: all };
  }

  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }

  getPokemonSpecies(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  }

  getEvolutionChainByUrl(url: string) {
    return this.http.get(url);
  }
}
