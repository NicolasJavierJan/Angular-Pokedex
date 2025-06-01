import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonService } from './services/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'Pokedex';
  pokemon : any[] = []

  constructor(private PokemonService: PokemonService) {}

  ngOnInit(): void {
    this.PokemonService.getPokemonList().subscribe(data => {
      console.log(data);
      this.pokemon = data.results;
    })
  }
}
