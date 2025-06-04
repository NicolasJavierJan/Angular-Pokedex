import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonStatsGraph } from './pokemon-stats-graph';

describe('PokemonStatsGraph', () => {
  let component: PokemonStatsGraph;
  let fixture: ComponentFixture<PokemonStatsGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonStatsGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonStatsGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
