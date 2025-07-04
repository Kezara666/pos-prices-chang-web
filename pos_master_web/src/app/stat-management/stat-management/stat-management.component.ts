import { ChangeDetectorRef, Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InvoiceDto } from '../../../models/purchase-order/purchase-order.dto';
import { InvoiceService } from '../../sale-management/purchase-order/invoice.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-stat-management',
  templateUrl: './stat-management.component.html',
  styleUrl: './stat-management.component.scss'
})
export class StatManagementComponent {

  totalSales: number = 0;
  // Line Chart
  basicData: any;

  // Bar Chart
  barData: any;

  // Pie Chart
  pieData: any;

  // Options for consistent theming
  chartOptions: any;

  purchaseOrders: InvoiceDto[] = [];
  displayInvoiceDetailsDialog: boolean = false;
  selectedInvoice: InvoiceDto | null = null;
  totalOrders: number = 0;


  constructor(private invoiceService: InvoiceService, private cdRef: ChangeDetectorRef) {

    this.initChartOptions();
    //this.initPieChart();

  }


  ngAfterViewInit(): void {
    this.loadPurchaseOrders();

  }



  loadPurchaseOrders(): void {
    this.invoiceService.getInvoices().subscribe(
      (data) => {
        this.purchaseOrders = data;
        console.log(data);
        this.totalSales = this.purchaseOrders.reduce((sum, order) => sum + order.netTotal, 0);
        this.totalOrders = this.purchaseOrders.length;
        this.initLineChartFromInvoices(this.purchaseOrders); // 👈 call here
        this.initBarChartFromInvoices(this.purchaseOrders);
        this.initPieChart(this.purchaseOrders);
        // Ensure the view updates with new data
      },
      (error) => {
        console.error('Failed to load purchase orders', error);
      }
    );
  }


  initLineChartFromInvoices(invoices: InvoiceDto[]) {
    const salesByDay = new Map<string, number>();

    for (const invoice of invoices) {
      if (invoice.createdAt) {
        const day = dayjs(invoice.createdAt).format('DD'); // e.g. '2025-07-04'

        const current = salesByDay.get(day) || 0;
        salesByDay.set(day, current + invoice.netTotal);
      }
    }

    // Sort by date
    const sortedDates = Array.from(salesByDay.keys()).sort(); // ensures chronological order
    const data = sortedDates.map(date => salesByDay.get(date) || 0);

    this.basicData = {
      labels: sortedDates,
      datasets: [
        {
          label: 'Daily Sales (Net Total)',
          data: data,
          fill: false,
          borderColor: getThemeColor('--p-primary-500'),
          backgroundColor: getThemeColor('--p-primary-500'),
          tension: 0.4
        }
      ]
    };
  }



  initBarChartFromInvoices(invoices: InvoiceDto[]) {
    const categoryMap = new Map<string, number>();

    for (const invoice of invoices) {
      for (const item of invoice.itemsSelled || []) {
        const category = item.product?.category ?? 'Unknown';
        const qty = item.qty ?? 0;

        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + qty);
      }
    }
    console.log(categoryMap);

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
    // Initialize pie chart data
    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'Units Sold',
          backgroundColor: getThemeColor('--p-primary-500'),
          borderColor: getThemeColor('--p-primary-700'),
          data: data
        }
      ]
    };
  }


  initPieChart(invoices: InvoiceDto[]) {
    const categoryMap = new Map<string, number>();

    for (const invoice of invoices) {
      for (const item of invoice.itemsSelled || []) {
        const category = item.product?.category ?? 'Unknown';
        const qty = item.qty ?? 0;

        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + qty);
      }
    }
    console.log(categoryMap);

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
    this.pieData = {
      labels: labels,
      datasets: [
        {
          data: data,
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