import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pokemon-stats-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './pokemon-stats-graph.html',
  styleUrls: ['./pokemon-stats-graph.css']
})
export class PokemonStatsGraph implements OnChanges {
  @Input() stats: { base_stat: number; stat: { name: string } }[] = [];
  @Input() pokemonName: string = '';

  radarChartData: ChartConfiguration<'radar'>['data'] = { labels: [], datasets: [] };
  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 160,
        ticks: { stepSize: 20 }
      }
    },
    elements: { line: { borderWidth: 2 } }
  };

  ngOnChanges() {
    if (this.stats.length) {
      this.radarChartData = {
        labels: this.stats.map(s => s.stat.name.toUpperCase()),
        datasets: [{
          data: this.stats.map(s => s.base_stat),
          label: this.pokemonName,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          pointBackgroundColor: 'rgba(75, 192, 192, 1)'
        }]
      };
    }
  }
}
