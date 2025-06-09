import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonEvolution } from './pokemon-evolution';

describe('PokemonEvolution', () => {
  let component: PokemonEvolution;
  let fixture: ComponentFixture<PokemonEvolution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonEvolution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonEvolution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
