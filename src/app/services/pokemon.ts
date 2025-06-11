import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  private cachedPokemonList: any[] | null = null;

  constructor(private http: HttpClient) { }

  getPokemonList(limit: number): Observable<any> {
    if (this.cachedPokemonList) {
      return of({ results: this.cachedPokemonList });
    }

    const url = `${this.baseUrl}?limit=${limit}`;
    return this.http.get<any>(url).pipe(
      tap(response => {
        this,this.cachedPokemonList = response.results;
      })
    );
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
