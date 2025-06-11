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
  
    loadAllPokemon(){
      this.loading = true;

      this.pokemonService.getPokemonList(1025).subscribe(data => {
        this.pokemon = data.results;
        this.filteredPokemon = [...this.pokemon];
        this.loading = false;
      });
    }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  applySearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredPokemon = [...this.pokemon];
    } else {
      this.filteredPokemon = this.pokemon.filter(p =>
        p.name.toLowerCase().includes(q)
      );
    }
  }
    onPokemonClick(name: string){
      this.selectedPokemon.emit(name);
    }

}
