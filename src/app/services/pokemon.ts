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

    const specialCases = ['nidoran-f', 'nidoran-m', ];

    for (const p of hyphenated) {
      try {
        const speciesName = specialCases.includes(p.name)
          ? p.name
          : p.name.includes('-')
          ? p.name.split('-')[0]
          : p.name;
        
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
