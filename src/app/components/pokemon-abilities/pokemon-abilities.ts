import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

interface Ability {
  ability: { name: string; url: string };
  is_hidden: boolean;
  description?: string;
}

@Component({
  selector: 'app-pokemon-abilities',
  imports: [CommonModule],
  templateUrl: './pokemon-abilities.html',
  styleUrl: './pokemon-abilities.css'
})
export class PokemonAbilities implements OnChanges {

  @Input() abilities: Ability[] = [];

  constructor(private http: HttpClient){}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['abilities'] && this.abilities.length){
      this.loadAbilitiesDescriptions();
    }
  }

  loadAbilitiesDescriptions(){
    const requests: Observable<any>[] = this.abilities.map(a => this.http.get(a.ability.url));  

    forkJoin(requests).subscribe(results => {
      results.forEach((res, i) => {
        const flavorTextEntry = res.effect_entries.find(
          (entry: any) => entry.language.name === 'en'
        );
        this.abilities[i].description = flavorTextEntry ? flavorTextEntry.short_effect : 'No Description Available';
      });
    });
  }
}
