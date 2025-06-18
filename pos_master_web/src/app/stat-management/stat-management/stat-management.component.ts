import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-stat-management',
  templateUrl: './stat-management.component.html',
  styleUrl:'./stat-management.component.scss'
})
export class StatManagementComponent {
  // Line Chart
  basicData: any;

  // Bar Chart
  barData: any;

  // Pie Chart
  pieData: any;

  // Options for consistent theming
  chartOptions: any;

  constructor() {
    this.initLineChart();
    this.initBarChart();
    this.initPieChart();
    this.initChartOptions();
  }

  initLineChart() {
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: getThemeColor('--p-primary-500'),
          backgroundColor: getThemeColor('--p-primary-500'),
          tension: 0.4
        },
        {
          label: 'Revenue',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: getThemeColor('--p-indigo-500'),
          backgroundColor: getThemeColor('--p-indigo-500'),
          tension: 0.4
        }
      ]
    };
  }

  initBarChart() {
    this.barData = {
      labels: ['Electronics', 'Clothing', 'Home', 'Books'],
      datasets: [
        {
          label: 'Units Sold',
          backgroundColor: getThemeColor('--p-primary-500'),
          borderColor: getThemeColor('--p-primary-700'),
          data: [300, 150, 100, 50]
        }
      ]
    };
  }

  initPieChart() {
    this.pieData = {
      labels: ['Electronics', 'Clothing', 'Home', 'Books'],
      datasets: [
        {
          data: [300, 150, 100, 50],
          backgroundColor: [
            getThemeColor('--p-primary-400'),
            getThemeColor('--p-primary-500'),
            getThemeColor('--p-primary-600'),
            getThemeColor('--p-primary-700')
          ],
          hoverBackgroundColor: [
            getThemeColor('--p-primary-300'),
            getThemeColor('--p-primary-400'),
            getThemeColor('--p-primary-500'),
            getThemeColor('--p-primary-600')
          ]
        }
      ]
    };
  }

  initChartOptions() {
    const textColor = getThemeColor('--text-color');
    const gridColor = getThemeColor('--surface-border');

    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor }
        }
      }
    };
  }
}

// Helper function to read theme colors
function getThemeColor(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}