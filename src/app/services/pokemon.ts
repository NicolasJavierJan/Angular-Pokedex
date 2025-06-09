import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonList(limit: number = 100, offset: number = 0): Observable<any> {
    const url = `${this.baseUrl}?limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url);
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
