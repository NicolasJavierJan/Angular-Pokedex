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
  evolutionChainList: { name: string; url: string }[] = [];

  constructor(private pokemonService: PokemonService) { console.log('asdf');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('aaaa');
    
    if (changes['name'] && this.name) {
      this.pokemonService.getPokemonSpecies(this.name).subscribe((species: any) => {
        const url = species?.evolution_chain?.url;
        if (url) {
          this.pokemonService.getEvolutionChainByUrl(url).subscribe((chain: any) => {
            this.evolutionChainList = this.extractEvolutionChain(chain.chain);
          });
        }
      });
    }
  }

  extractEvolutionChain(chainNode: any): { name: string; url: string }[] {
    const result: { name: string; url: string }[] = [];

    const traverse = (node: any) => {
      console.log('Visiting:', node.species.name);
      result.push(node.species);
      if (node.evolves_to && node.evolves_to.length > 0) {
        for (const evo of node.evolves_to) {
          traverse(evo);
        }
      }
    };

    traverse(chainNode);
    console.log('Full evolution list:', result.map(r => r.name));
    return result;
  }

  getIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
