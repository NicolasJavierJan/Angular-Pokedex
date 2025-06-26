import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { PokemonService } from '../../services/pokemon';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css'
})

export class PokemonList implements OnInit{
    protected title = 'Pokedex';
    pokemon : any[] = [];
    filteredPokemon : any[] = [];
    loading = false;

    search : String = '';
    private searchSubject = new Subject<string>();

    @Output() selectedPokemon = new EventEmitter<string>();
  
    constructor(private pokemonService: PokemonService) { 
      this.searchSubject.pipe(debounceTime(300)).subscribe(query => {
      this.applySearch(query);
      });
    }

    ngOnInit(): void {
      this.loadAllPokemon();
    }
  
    async loadAllPokemon() {
      this.loading = true;

      try {
        const data = await this.pokemonService.getPokemonList(1025);
        this.pokemon = data;
        this.filteredPokemon = [...this.pokemon];
      } catch (error) {
        console.error('Failed to load Pokémon:', error);
      } finally {
        this.loading = false;
      }
    }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  applySearch(query: string) {
    const normalize = (input: string) =>
      input
        .toLowerCase()
        .trim()
        .replace(/[.’']/g, '')       // remove dots/apostrophes
        .replace(/\s+/g, '-')        // spaces → hyphens
        .normalize("NFD")            // remove accents
        .replace(/[\u0300-\u036f]/g, '');

    const q = normalize(query);

    if (!q) {
      this.filteredPokemon = [...this.pokemon];
    } else {
      this.filteredPokemon = this.pokemon.filter(p => {
        const normalizedName = normalize(p.name);
        const normalizedDisplayName = p.displayName ? normalize(p.displayName) : '';

        return normalizedName.includes(q) || normalizedDisplayName.includes(q);
      });
    }
  }
    onPokemonClick(name: string){
      this.selectedPokemon.emit(name);
    }

}
