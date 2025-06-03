import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule],
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
      console.log(detail);
      this.pokemonDetail = detail;
    });
  }
}
