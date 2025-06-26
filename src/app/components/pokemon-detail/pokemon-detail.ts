import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon';
import { CommonModule } from '@angular/common';
import { PokemonTypes } from '../pokemon-types/pokemon-types';
import { PokemonSpecies } from '../pokemon-species/pokemon-species';
import { PokemonEvolution } from '../pokemon-evolution/pokemon-evolution';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule, PokemonTypes, PokemonSpecies, PokemonEvolution],
  templateUrl: './pokemon-detail.html',
  styleUrls: ['./pokemon-detail.css'],
  standalone: true,
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
    this.pokemonDetail = null;
    this.pokemonService.getFullPokemonDetail(name).then(detail => {
      this.pokemonDetail = detail;
      console.log(this.pokemonDetail);
    });
  }

  
}
