import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-pokemon-evolution',
  imports: [CommonModule],
  templateUrl: './pokemon-evolution.html',
  styleUrl: './pokemon-evolution.css'
})
export class PokemonEvolution implements OnChanges {
  @Input() name: string = '';
  evolutionChainList: { name: string; url: string; displayName?: string }[] = [];

  constructor(private pokemonService: PokemonService) { console.log('asdf');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] && this.name) {
      const speciesName = this.pokemonService.resolveSpeciesName(this.name);
      this.pokemonService.getPokemonSpecies(speciesName).subscribe((species: any) => {
        const url = species?.evolution_chain?.url;
        if (url) {
          this.pokemonService.getEvolutionChainByUrl(url).subscribe((chain: any) => {
            const rawList = this.extractEvolutionChain(chain.chain);
            // Add displayName property to each
            this.evolutionChainList = rawList.map(p => ({
              ...p,
              displayName: this.pokemonService.getDisplayName(p.name)
            }));
          });
        }
      });
    }
  }

  extractEvolutionChain(chainNode: any): { name: string; url: string }[] {
    const result: { name: string; url: string }[] = [];

    const traverse = (node: any) => {
      result.push(node.species);
      if (node.evolves_to && node.evolves_to.length > 0) {
        for (const evo of node.evolves_to) {
          traverse(evo);
        }
      }
    };

    traverse(chainNode);
    return result;
  }

  getIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
