import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.html',
  styleUrls: ['./pokemon-detail.css']
})

export class PokemonDetailComponent implements OnChanges{

  @Input() pokemonName?: string;
  pokemonDetail: any;

  constructor(private pokemonService: PokemonService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pokemonName'] && this.pokemonName) {
      this.loadPokemonDetail(this.pokemonName);
    }
  }

  loadPokemonDetail(name: string) {
    this.pokemonService.getPokemonDetails(name).subscribe(detail => {
      this.pokemonDetail = detail;
    });
  }
}
