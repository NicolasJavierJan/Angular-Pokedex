import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon';
import { CommonModule } from '@angular/common';
import { PokemonStatsGraph } from '../pokemon-stats-graph/pokemon-stats-graph';
import { PokemonTypes } from '../pokemon-types/pokemon-types';
import { PokemonAbilities } from '../pokemon-abilities/pokemon-abilities';
import { PokemonSpecies } from '../pokemon-species/pokemon-species';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule, PokemonStatsGraph, PokemonTypes, PokemonAbilities, PokemonSpecies],
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
    this.pokemonService.getPokemonDetails(name).subscribe(detail => {
      this.pokemonDetail = detail;
    });
  }
}
