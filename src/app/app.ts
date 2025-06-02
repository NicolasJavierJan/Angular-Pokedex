import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonService } from './services/pokemon';
import { CommonModule } from '@angular/common';
import { PokemonList } from "./components/pokemon-list/pokemon-list";
import { PokemonDetailComponent } from "./components/pokemon-detail/pokemon-detail";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PokemonList, PokemonDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = "Pokedex"
}
