import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { PokemonService } from '../../services/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css'
})
export class PokemonList implements AfterViewInit{
    protected title = 'Pokedex';
    pokemon : any[] = []
    limit = 100;
    offset = 0;
    loading = false;
    allLoaded = false;

    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

    @Output() selectedPokemon = new EventEmitter<string>();
  
    constructor(private pokemonService: PokemonService) {
      this.loadPokemon();
    }

    ngAfterViewInit(){
      this.scrollContainer.nativeElement.addEventListener('scroll', () => {
        const el = this.scrollContainer.nativeElement;
        if (el.scrollHeight - el.scrollTop <= el.clientHeight + 10) {
          this.loadPokemon();
        }
      })
    }
  
    loadPokemon(){
      if (this.loading || this.allLoaded) return;

      this.loading = true;

      const remaining = 1025 - this.offset;
      
      const fetchLimit = remaining < this.limit ? remaining : this.limit;

      this.pokemonService.getPokemonList(fetchLimit, this.offset).subscribe(data => {
        this.pokemon = [...this.pokemon, ...data.results];
        this.offset += fetchLimit;

        if (this.offset >= 1025 || !data.next) {
          this.allLoaded = true;
        }

        this.loading = false;
      });
    }

    onPokemonClick(name: string){
      this.selectedPokemon.emit(name);
    }

}
