import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-pokemon-species',
  imports: [CommonModule],
  templateUrl: './pokemon-species.html',
  styleUrl: './pokemon-species.css'
})
export class PokemonSpecies implements OnChanges{
  @Input() name: string = '';
  speciesInfo: any = null;
  flavorText: string = '';

  constructor(private pokemonService: PokemonService) {}

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] && this.name) {
      this.pokemonService.getPokemonSpecies(this.name).subscribe((data: any) => {
      this.speciesInfo = data;

      const englishTexts = data.flavor_text_entries.filter(
        (entry: any) => entry.language.name === 'en'
      );

      const randomText = englishTexts[Math.floor(Math.random() * englishTexts.length)];

      this.flavorText = randomText?.flavor_text.replace(/[\f\n]/g, ' ') ?? '';
      });
    }
  }
}
